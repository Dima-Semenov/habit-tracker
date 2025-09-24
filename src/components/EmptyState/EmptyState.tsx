import {
  ButtonGroup,
  Center,
  EmptyState,
  EmptyStateRootProps,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IconType } from 'react-icons';

interface EmptyStateComponentProps extends EmptyStateRootProps {
  title: string;
  description: string;
  icon?: IconType | null;
  actions?: React.ReactNode;
}

const EmptyStateComponent: FC<EmptyStateComponentProps> = ({
  size = 'sm',
  title,
  description,
  icon: Icon = null,
  actions = null,
}) => {
  return (
    <Center h='full'>
      <EmptyState.Root size={size}>
        <EmptyState.Content>
          {Icon && (
            <EmptyState.Indicator>
              <Icon />
            </EmptyState.Indicator>
          )}
          <VStack textAlign='center'>
            <EmptyState.Title>{title}</EmptyState.Title>
            <EmptyState.Description>{description}</EmptyState.Description>
          </VStack>

          {actions && <ButtonGroup>{actions}</ButtonGroup>}
        </EmptyState.Content>
      </EmptyState.Root>
    </Center>
  );
};

export default EmptyStateComponent;
