import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { getSetting, setSetting } from '../../../store/slices/settings';
import {
  FormField,
  FormFieldParams,
  useFormField,
} from '../../../ui-atoms/input/FormControl';
import { Setting, SettingsStore } from '../../../utils-electron/Settings.types';
import { ErrorReport } from '../../../utils/ErrorReport';

export default function useSettingField<S extends Setting>(
  setting: S,
  params: Omit<FormFieldParams<SettingsStore[S]>, 'initialValue'>,
): {
  field: FormField<SettingsStore[S]>;
  save: () => ErrorReport | undefined;
  reset: () => void;
} {
  const initialValue = useSelector(getSetting(setting));
  const field = useFormField<SettingsStore[S]>({ initialValue, ...params });

  const dispatch = useDispatch<AppDispatch>();

  const save = useCallback(() => {
    return dispatch(setSetting(setting, field.value));
  }, [dispatch, field.value, setting]);

  const reset = useCallback(() => {
    return field.handleChange(initialValue);
  }, [field.handleChange, initialValue]);

  return { field, save, reset };
}
