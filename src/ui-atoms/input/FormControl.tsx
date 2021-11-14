import * as Chakra from '@chakra-ui/react';
import { QuestionIcon, WarningIcon } from '@chakra-ui/icons';
import { ReactElement, ReactNode } from 'react';
import Tooltip from '../overlay/Tooltip';
import { ErrorReport } from '../../utils/ErrorReport';

interface FormControlProps {
  children: ReactNode;
  errorReport?: ErrorReport;
  infoMessage?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  label: string;
}

function ErrorTooltipLabel({ messages }: { messages: string[] }): ReactElement {
  return (
    <Chakra.VStack alignItems='flex-start' spacing={1}>
      {messages.map((message) => (
        <Chakra.Text key={message}>{message}</Chakra.Text>
      ))}
    </Chakra.VStack>
  );
}

export default function FormControl({
  children,
  errorReport,
  infoMessage,
  isDisabled,
  isInvalid,
  isRequired = false,
  label,
}: FormControlProps): ReactElement {
  return (
    <Chakra.FormControl
      isRequired={isRequired}
      label={label}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
    >
      <Chakra.FormLabel display='flex' flexDirection='row' alignItems='center'>
        <Chakra.Text>{label}</Chakra.Text>
        {infoMessage && (
          <Tooltip label={infoMessage} placement='top'>
            <QuestionIcon w={3} h={3} ml={1} color='app.info' />
          </Tooltip>
        )}
      </Chakra.FormLabel>
      {children}
      {errorReport && (
        <Chakra.FormErrorMessage
          display='flex'
          flexDirection='row'
          alignItems='center'
        >
          <Chakra.Text>{errorReport.main}</Chakra.Text>
          {errorReport.others.length > 0 && (
            <Tooltip
              label={<ErrorTooltipLabel messages={errorReport.all()} />}
              placement='top'
            >
              <WarningIcon w={3} h={3} ml={1} />
            </Tooltip>
          )}
        </Chakra.FormErrorMessage>
      )}
    </Chakra.FormControl>
  );
}
