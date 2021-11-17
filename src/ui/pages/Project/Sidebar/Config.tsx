import { EditIcon } from '@chakra-ui/icons';
import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { ProjectConfig } from '../../../../core/Project';
import IconButton from '../../../../ui-atoms/input/IconButton';
import ConfigEditor from './ConfigEditor';

interface ConfigProps {
  config: ProjectConfig;
  isDisabled: boolean;
  onEdit: (config: ProjectConfig) => void;
}

export default function Config({
  config,
  isDisabled,
  onEdit,
}: ConfigProps): ReactElement {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <VStack
        bg='app.bg2'
        w='256px'
        height='100%'
        p={6}
        alignItems='flex-start'
      >
        <Flex alignItems='center' width='100%'>
          <Heading
            flex={1}
            mr={2}
            size='sm'
            fontStyle={isDisabled ? 'italic' : undefined}
          >
            {config.name}
          </Heading>
          <IconButton
            icon={<EditIcon />}
            isDisabled={isDisabled}
            label='Edit config'
            onClick={() => setIsEditorOpen(true)}
            size='xs'
            variant='ghost'
          />
        </Flex>

        <VStack spacing={1} alignItems='flex-start'>
          <Text fontSize={14}>Author: {config.author || '-'}</Text>
        </VStack>
      </VStack>
      {isEditorOpen && (
        <ConfigEditor
          config={config}
          onCancel={() => setIsEditorOpen(false)}
          onConfirm={(newConfig) => {
            setIsEditorOpen(false);
            onEdit(newConfig);
          }}
        />
      )}
    </>
  );
}
