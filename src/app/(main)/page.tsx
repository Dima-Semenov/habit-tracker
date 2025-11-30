'use client';

import { getTodayProgress } from '@/actions/habit.actions';
import { useUserStore } from '@/store/userStore';
import {
  Box,
  Button,
  Flex,
  For,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState, useTransition } from 'react';
import { CreateGroupButton } from './group/components';
import { CreateHabitButton } from './habits/components';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { getHabitGroups } from '@/actions/habitGroups.actions';
import { HabitType } from '@/types/habitTypes';
import { useHabitsStore } from '@/store/habitsStore';

export function HabitGroupCard({ group }: { group: HabitGroupType }) {
  return (
    <Box
      p={4}
      rounded='xl'
      shadow='sm'
      cursor='pointer'
      transition='transform 0.3s ease-in-out'
      _hover={{ shadow: 'md', transform: 'scale(1.05)' }}
    >
      <Flex gap={2}>
        {group.emoji && <Text textStyle='4xl'>{group.emoji}</Text>}
        <Heading size='sm'>{group.title}</Heading>
      </Flex>
    </Box>
  );
}

export function HabitCard({ habit }: { habit: HabitType }) {
  return (
    <Box
      p={4}
      rounded='xl'
      shadow='sm'
      cursor='pointer'
      transition='transform 0.3s ease-in-out'
      _hover={{ shadow: 'md', transform: 'scale(1.05)' }}
    >
      <Flex gap={2} flexDirection='column'>
        <HStack>
          <Text textStyle='xl'>{habit.type === 'goodHabit' ? '🌱' : '🚫'}</Text>
          <Heading size='sm' fontWeight='bold'>
            {habit.title}
          </Heading>
        </HStack>
        <Text fontSize='xs' color='gray.500'>
          {habit.title}
        </Text>
      </Flex>
    </Box>
  );
}

type TodayProgressType = {
  percent: number;
  completed: number;
  total: number;
};

const Home = () => {
  const [todayProgress, setTodayProgress] = useState<TodayProgressType | null>(
    null
  );
  const [habitGroups, setHabitGroups] = useState<HabitGroupType[]>([]);
  const { user } = useUserStore();
  const { fetchAllHabits, getActiveHabits } = useHabitsStore();
  const activeHabits = getActiveHabits();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    const fetchProgress = () => {
      startTransition(async () => {
        const progress = await getTodayProgress(userId);
        setTodayProgress(progress);

        const habitGroupsResponse = await getHabitGroups({ userId });
        setHabitGroups(habitGroupsResponse);

        await fetchAllHabits({ userId });
      });
    };

    const load = async () => {
      try {
        fetchProgress();
      } catch (error) {
        console.log('error: ', error);
      }
    };

    load();
  }, [user]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <Box px={{ base: 4, md: 8 }} py={8} maxW='6xl' mx='auto' w='full'>
        <VStack align='center'>
          <Heading size='3xl'>Hello, {user?.username}! 👋</Heading>
          <Text fontSize='md' color='gray.500'>
            Have a nice day! Check your habits and take another step towards
            your goals 🌱
          </Text>
        </VStack>

        {todayProgress && (
          <Box mt={8}>
            <Box>
              <Flex justify='space-between' mb={2}>
                <Text fontWeight='medium'>Your progress today</Text>
                <Text color='gray.500'>{todayProgress.percent}%</Text>
              </Flex>
              <Progress.Root defaultValue={0} value={todayProgress.percent}>
                <Progress.Track flex='1'>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>
          </Box>
        )}

        <HStack
          mt={8}
          justifyContent='center'
          flexDirection={{ base: 'column', sm: 'row' }}
        >
          <CreateHabitButton />
          <CreateGroupButton />
        </HStack>

        <Box mt={10}>
          <Flex
            mb={4}
            alignItems='center'
            gap={4}
            justifyContent='space-between'
          >
            <Heading size='md'>My groups</Heading>

            <Button variant='ghost'>View all ({habitGroups.length})</Button>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
            <For each={habitGroups.slice(0, 6)}>
              {(group) => <HabitGroupCard key={group._id} group={group} />}
            </For>
          </SimpleGrid>
        </Box>

        <Box mt={10}>
          <Flex
            mb={4}
            alignItems='center'
            gap={4}
            justifyContent='space-between'
          >
            <Heading size='md'>Active habits</Heading>

            <Button variant='ghost'>View all ({activeHabits.length})</Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
            <For each={activeHabits.slice(0, 6)}>
              {(habit) => <HabitCard key={habit._id} habit={habit} />}
            </For>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
