import {
  createHabitGroup,
  updateHabitGroup,
} from '@/actions/habitGroups.actions';
import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE, HABIT_GROUP_EMOJIS } from '@/constants';
import { useUserStore } from '@/store/userStore';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  title: string;
  description: string;
  emoji: string;
}

const DEFAULT_FORM_DATA: FormData = {
  title: '',
  description: '',
  emoji: HABIT_GROUP_EMOJIS[0],
};

interface UseHabitGroupModalControllerArgs {
  isShow: boolean;
  editHabitGroup: null | HabitGroupType;
  handleHideModal: () => void;
}

export const useHabitGroupModalController = ({
  isShow,
  editHabitGroup,
  handleHideModal,
}: UseHabitGroupModalControllerArgs) => {
  const { user } = useUserStore();

  const { control, formState, register, handleSubmit, reset, watch } = useForm({
    defaultValues: DEFAULT_FORM_DATA,
  });
  const titleValue = watch('title');
  const isEditMode = Boolean(editHabitGroup);

  const onSubmit = handleSubmit(async (data: FormData) => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    try {
      let result = null;
      let toasterTitle = '';

      if (isEditMode && editHabitGroup?._id) {
        result = await updateHabitGroup(editHabitGroup._id, data);
        toasterTitle = 'Habit group was updated successfully';
      } else {
        result = await createHabitGroup({
          ...data,
          userId,
        });
        toasterTitle = `Habit group created successfully`;
      }

      if (result && result.success) {
        toaster.create({
          title: toasterTitle,
          type: 'success',
        });
      }
    } catch (error) {
      let errorMessage = GENERAL_ERROR_MESSAGE;

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toaster.create({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      handleHideModal();
    }
  });

  useEffect(() => {
    if (isShow) {
      if (!editHabitGroup) {
        reset(DEFAULT_FORM_DATA);
        return;
      }
      const { title, description, emoji } = editHabitGroup;

      reset({ title, description, emoji });
    }
  }, [reset, isShow, isEditMode, editHabitGroup]);

  const buttonTitle = useMemo(() => {
    const { isSubmitting } = formState;

    if (isSubmitting) {
      return isEditMode ? 'Editing...' : 'Creating...';
    }

    return isEditMode ? 'Edit' : 'Create';
  }, [formState, isEditMode]);

  const modalTitle = isEditMode ? `Edit ${editHabitGroup?.title} habit group` : 'Create habit group';

  return {
    formState,
    titleValue,
    register,
    control,
    buttonTitle,
    onSubmit,
    modalTitle,
  };
};
