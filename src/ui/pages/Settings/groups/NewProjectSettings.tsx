import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useImperativeHandle,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSettingString,
  setSettingString,
} from '../../../../store/slices/settings';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import FormControl, {
  useFormField,
} from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { SettingString } from '../../../../utils-electron/Settings.types';
import SettingsGroup from '../SettingsGroup';

const { $FileSystem } = window.api;

export interface NewProjectSettingsRef {
  reset: () => void;
  save: () => void;
}

function NewProjectSettings(
  props: {},
  ref: ForwardedRef<NewProjectSettingsRef>,
): ReactElement {
  const defaultAuthor = useSelector(
    getSettingString(SettingString.NewProjectDefaultAuthor),
  );
  const defaultAuthorField = useFormField({
    infoMessage: 'Default author for new projects',
    initialValue: defaultAuthor,
    label: 'Default author',
  });

  const defaultLocationDirPath = useSelector(
    getSettingString(SettingString.NewProjectDefaultLocationDirPath),
  );
  const defaultLocationDirPathField = useFormField({
    infoMessage: 'Default directory for new projects',
    initialValue: defaultLocationDirPath,
    label: 'Default destination directory',
    onValidate: $FileSystem.validateExistsDir,
  });

  const defaultRomFilePath = useSelector(
    getSettingString(SettingString.NewProjectDefaultRomFilePath),
  );
  const defaultRomFilePathField = useFormField({
    infoMessage: 'ROM used for the project (a copy will be made).',
    initialValue: defaultRomFilePath,
    label: 'Default ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    save: () => {
      dispatch(
        setSettingString(
          SettingString.NewProjectDefaultAuthor,
          defaultAuthorField.value,
        ),
      );
      dispatch(
        setSettingString(
          SettingString.NewProjectDefaultLocationDirPath,
          defaultLocationDirPathField.value,
        ),
      );
      dispatch(
        setSettingString(
          SettingString.NewProjectDefaultRomFilePath,
          defaultRomFilePathField.value,
        ),
      );
    },
    reset: () => {
      defaultAuthorField.handleChange(defaultAuthor);
      defaultLocationDirPathField.handleChange(defaultLocationDirPath);
      defaultRomFilePathField.handleChange(defaultRomFilePath);
    },
  }));

  return (
    <SettingsGroup title='New project'>
      <FormControl {...defaultAuthorField.control}>
        <TextInput
          onBlur={defaultAuthorField.handleBlur}
          onChange={defaultAuthorField.handleChange}
          placeholder={defaultAuthorField.control.label}
          value={defaultAuthorField.value}
        />
      </FormControl>

      <FormControl {...defaultLocationDirPathField.control}>
        <BrowserInput
          mode='directory'
          onBlur={defaultLocationDirPathField.handleBlur}
          onChange={defaultLocationDirPathField.handleChange}
          placeholder={defaultLocationDirPathField.control.label}
          value={defaultLocationDirPathField.value}
        />
      </FormControl>

      <FormControl {...defaultRomFilePathField.control}>
        <BrowserInput
          filters={[{ name: 'ROM', extensions: ['smc'] }]}
          mode='file'
          onBlur={defaultRomFilePathField.handleBlur}
          onChange={defaultRomFilePathField.handleChange}
          placeholder={defaultRomFilePathField.control.label}
          value={defaultRomFilePathField.value}
        />
      </FormControl>
    </SettingsGroup>
  );
}

export default forwardRef<NewProjectSettingsRef>(NewProjectSettings);