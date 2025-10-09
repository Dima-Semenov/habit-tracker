import React, { FC } from 'react';
import { HabitType } from '@/types/habitTypes';
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Progress,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useHabitCardController } from './useHabitCardController';
import HabitOptions from '../HabitOptions/HabitOptions';
import { HABIT_TYPE } from '@/constants';

interface HabitCardProps {
  habit: HabitType;
}

const HabitCard: FC<HabitCardProps> = ({ habit }) => {
  const {
    completedProgerssCount,
    percentOfCompleted,
    isCompletedToday,
    currentStreak,
    maxStreak,
    updateProgress,
    makeHabitAsArchived,
  } = useHabitCardController({ habit });
  const isFooterVisible = habit.isTargetAchieved || !isCompletedToday;
  const isShowFollowContent = !isCompletedToday && !habit.isTargetAchieved;
  const isShowDescription = habit.description && !habit.isTargetAchieved;

  const isGoodHabit = habit.type === HABIT_TYPE.GOOD_HABIT;

  return (
    <Card.Root
      w='full'
      maxW='400px'
      borderColor={isGoodHabit ? 'green.400' : 'red.400'}
    >
      <Card.Header
        flexDirection='row'
        justifyContent='space-between'
        gap={2}
        px={{ base: 4, sm: 6 }}
        pt={{ base: 4, sm: 6 }}
      >
        <HStack>
          <Text textStyle='5xl'>{isGoodHabit ? '🌱' : '🚫'}</Text>
          <Card.Title>{habit.title}</Card.Title>
        </HStack>
        <HabitOptions habit={habit} />
      </Card.Header>

      <Card.Body p={{ base: 4, sm: 6 }}>
        {isShowDescription && (
          <Card.Description>Description: {habit.description}</Card.Description>
        )}

        {habit.isTargetAchieved ? (
          <Stack>
            <Text fontWeight='bold' textStyle='xl' textAlign='center'>
              Congratulations! 🎉
            </Text>
            <Text fontWeight='semibold' textStyle='md' textAlign='center'>
              You have achieved your goal for this habit. Keep up the good work!
              ✅
            </Text>
          </Stack>
        ) : (
          <Flex flexDirection='column' py={4}>
            <Separator my={2} />

            <Flex justifyContent='space-evenly' alignItems='center' gap={4}>
              <Stack alignItems='center'>
                <Text textStyle='md' fontWeight='semibold'>
                  Target 🎯
                </Text>
                <Text textStyle='xs'>{habit.target} days</Text>
              </Stack>
              <Separator orientation='vertical' mx={2} h={6} />
              <Stack alignItems='center'>
                <Text textStyle='md' fontWeight='semibold'>
                  Completed ✅
                </Text>
                <Text textStyle='xs'>{completedProgerssCount} days</Text>
              </Stack>
            </Flex>

            <Separator my={2} />

            <Flex justifyContent='space-evenly' alignItems='center' gap={4}>
              <Stack alignItems='center'>
                <Text textStyle='md' fontWeight='semibold'>
                  Streak 🔥
                </Text>
                <Text textStyle='xs'>{currentStreak} days</Text>
              </Stack>
              <Separator orientation='vertical' mx={2} h={6} />
              <Stack alignItems='center'>
                <Text textStyle='md' fontWeight='semibold'>
                  Max streak 🔝
                </Text>
                <Text textStyle='xs'>{maxStreak} days</Text>
              </Stack>
            </Flex>

            <Separator my={2} />
          </Flex>
        )}

        {!habit.isTargetAchieved && (
          <Progress.Root defaultValue={0} value={percentOfCompleted}>
            <HStack gap='5'>
              <Progress.Label>Progress:</Progress.Label>
              <Progress.Track flex='1'>
                <Progress.Range />
              </Progress.Track>
              <Progress.ValueText>{percentOfCompleted}%</Progress.ValueText>
            </HStack>
          </Progress.Root>
        )}
      </Card.Body>

      {isFooterVisible && (
        <Card.Footer
          justifyContent='center'
          px={{ base: 4, sm: 6 }}
          pb={{ base: 4, sm: 6 }}
        >
          {isShowFollowContent && (
            <Box>
              <Text mb={4} fontWeight='bold' textStyle='xl' textAlign='center'>
                Do you follow this habit today?
              </Text>
              <HStack justifyContent='center'>
                <Button
                  colorPalette='green'
                  onClick={() =>
                    updateProgress({
                      habitId: habit._id,
                      completed: true,
                    })
                  }
                >
                  Yes
                </Button>
                <Button
                  colorPalette='red'
                  onClick={() =>
                    updateProgress({
                      habitId: habit._id,
                      completed: false,
                    })
                  }
                >
                  No
                </Button>
              </HStack>
            </Box>
          )}
          {habit.isTargetAchieved && (
            <Button
              variant='outline'
              onClick={() => makeHabitAsArchived(habit._id)}
            >
              Archive this habit 🗃️
            </Button>
          )}
        </Card.Footer>
      )}
    </Card.Root>
  );
};

export default HabitCard;
