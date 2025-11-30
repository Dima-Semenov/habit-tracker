import { getHabitGroups } from '@/actions/habitGroups.actions';
import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { useHabitsStore } from '@/store/habitsStore';
import { useUserStore } from '@/store/userStore';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { HabitType, HabitTypes } from '@/types/habitTypes';
import { createListCollection } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseHabitModalControllerArgs {
  isShow: boolean;
  handleHideModal: () => void;
  editHabit: HabitType | null;
}

interface FormData {
  title: string;
  description: string;
  type: HabitTypes;
  groupId: string[];
  target: string;
}

const DEFAULT_FORM_DATA: FormData = {
  title: '',
  description: '',
  type: 'goodHabit',
  groupId: [],
  target: '1',
};

export const useHabitModalController = ({
  isShow,
  handleHideModal,
  editHabit,
}: UseHabitModalControllerArgs) => {
  const { user } = useUserStore();
  const { updateHabit, createHabit } = useHabitsStore();

  const { register, handleSubmit, formState, control, watch, reset } = useForm({
    defaultValues: DEFAULT_FORM_DATA,
  });

  const isEditMode = Boolean(editHabit);
  const titleValue = watch('title');

  const [habitGroups, setHabitGroups] = useState<HabitGroupType[]>([]);

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    const loadHabitGroups = async () => {
      try {
        const habitGroupsResponse = await getHabitGroups({ userId });
        setHabitGroups(habitGroupsResponse);
      } catch (error: unknown) {
        let errorMessage = GENERAL_ERROR_MESSAGE;

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toaster.create({
          title: errorMessage,
          type: 'error',
        });
      }
    };

    loadHabitGroups();
  }, [user]);

  useEffect(() => {
    if (isShow) {
      if (!editHabit) {
        reset(DEFAULT_FORM_DATA);
        return;
      }
      const { title, description, type, groupId, target } = editHabit;

      const groupIdValue = groupId ? [groupId] : [];

      reset({ title, description, type, target, groupId: groupIdValue });
    }
  }, [reset, isShow, isEditMode, editHabit]);

  const onSubmit = handleSubmit(async (data: FormData) => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    try {
      const groupIdValue = Boolean(data.groupId[0]) ? data.groupId[0] : null;

      let toasterTitle = '';

      if (isEditMode && editHabit?._id) {
        const dataToUpdate = {
          ...data,
          groupId: groupIdValue,
        };

        await updateHabit({ habitId: editHabit._id, data: dataToUpdate });
        toasterTitle = 'The habit was updated successfully';
      } else {
        const createHabitData = {
          ...data,
          groupId: groupIdValue,
          userId,
        };

        await createHabit({ createHabitData });
        toasterTitle = 'The habit was created successfully';
      }

      toaster.create({
        title: toasterTitle,
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        type: 'error',
      });
    } finally {
      handleHideModal();
    }
  });

  const habitGroupOptions = useMemo(
    () =>
      createListCollection({
        items: habitGroups.map((habitGroup) => ({
          label: habitGroup.title,
          value: habitGroup._id,
        })),
      }),
    [habitGroups]
  );

  const buttonTitle = useMemo(() => {
    const { isSubmitting } = formState;

    if (isSubmitting) {
      return isEditMode ? 'Editing...' : 'Creating...';
    }

    return isEditMode ? 'Edit' : 'Create';
  }, [formState, isEditMode]);

  const modalTitle = isEditMode
    ? `Edit ${editHabit?.title} habit`
    : 'Create a new habit';

  return {
    register,
    onSubmit,
    formState,
    control,
    titleValue,
    buttonTitle,
    habitGroupOptions,
    modalTitle,
  };
};
