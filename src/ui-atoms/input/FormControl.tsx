import * as Chakra from '@chakra-ui/react';
import { QuestionIcon, WarningIcon } from '@chakra-ui/icons';
import { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import Tooltip from '../overlay/Tooltip';
import { ErrorReport } from '../../utils/ErrorReport';

/**
 * FormControl
 */

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

/**
 * useFormField
 */

interface FormField<T> {
  control: {
    errorReport: ErrorReport | undefined;
    infoMessage: string | undefined;
    isInvalid: boolean;
    isRequired: boolean;
    label: string;
  };
  handleBlur: () => void;
  handleChange: (value: T) => void;
  isValid: boolean;
  value: T;
}

export function useFormField<T>({
  infoMessage,
  initialValue,
  isRequired = false,
  label,
  onValidate = () => undefined,
}: {
  infoMessage?: string;
  initialValue: T;
  isRequired?: boolean;
  label: string;
  onValidate?: (value: T) => ErrorReport | undefined;
}): FormField<T> {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const [errorReport, setErrorReport] = useState<ErrorReport | undefined>();

  const handleChange = useCallback(
    (newValue: T) => {
      const newErrorReport = onValidate(newValue);
      setErrorReport(newErrorReport);
      setIsDirty(true);
      setValue(newValue);
    },
    [onValidate],
  );

  const handleBlur = useCallback(() => {
    const newErrorReport = onValidate(value);
    setErrorReport(newErrorReport);
    setIsDirty(true);
  }, [value]);

  const isValid = useMemo(() => {
    return isDirty ? !errorReport : !onValidate(initialValue);
  }, [isDirty, errorReport, initialValue, onValidate]);

  return {
    control: {
      errorReport,
      infoMessage,
      isInvalid: Boolean(errorReport) && isDirty,
      isRequired,
      label,
    },
    handleBlur,
    handleChange,
    isValid,
    value,
  };
}

/**
 * useForm
 */

interface Form {
  isValid: boolean;
}

export function useForm({ fields }: { fields: FormField<any>[] }): Form {
  const isValid = useMemo(() => {
    return fields.every((field) => !field.control.isRequired || field.isValid);
  }, [fields]);

  return {
    isValid,
  };
}
