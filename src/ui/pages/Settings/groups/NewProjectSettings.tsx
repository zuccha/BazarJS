import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useImperativeHandle,
} from 'react';
import BrowserInput from '../../../../ui-atoms/input/BrowserInput';
import FormControl from '../../../../ui-atoms/input/FormControl';
import TextInput from '../../../../ui-atoms/input/TextInput';
import { Setting } from '../../../../utils-electron/Settings.types';
import SettingsGroup from '../SettingsGroup';
import useSettingField from '../useSettingsField';

const { $FileSystem } = window.api;

export interface NewProjectSettingsRef {
  reset: () => void;
  save: () => void;
}

function NewProjectSettings(
  props: {},
  ref: ForwardedRef<NewProjectSettingsRef>,
): ReactElement {
  const author = useSettingField(Setting.NewProjectDefaultAuthor, {
    infoMessage: 'Default author for new projects',
    label: 'Default author',
  });

  const locationDirPath = useSettingField(
    Setting.NewProjectDefaultLocationDirPath,
    {
      infoMessage: 'Default directory for new projects',
      label: 'Default destination directory',
      onValidate: $FileSystem.validateExistsDir,
    },
  );

  const romFilePath = useSettingField(Setting.NewProjectDefaultRomFilePath, {
    infoMessage: 'ROM used for the project (a copy will be made).',
    label: 'Default ROM file',
    onValidate: (value: string) =>
      $FileSystem.validateExistsFile(value) ||
      $FileSystem.validateHasExtension(value, '.smc'),
  });

  useImperativeHandle(ref, () => ({
    save: () => {
      author.save();
      locationDirPath.save();
      romFilePath.save();
    },
    reset: () => {
      author.reset();
      locationDirPath.reset();
      romFilePath.reset();
    },
  }));

  return (
    <SettingsGroup title='New project'>
      <FormControl {...author.field.control}>
        <TextInput
          onBlur={author.field.handleBlur}
          onChange={author.field.handleChange}
          placeholder={author.field.control.label}
          value={author.field.value}
        />
      </FormControl>

      <FormControl {...locationDirPath.field.control}>
        <BrowserInput
          mode='directory'
          onBlur={locationDirPath.field.handleBlur}
          onChange={locationDirPath.field.handleChange}
          placeholder={locationDirPath.field.control.label}
          value={locationDirPath.field.value}
        />
      </FormControl>

      <FormControl {...romFilePath.field.control}>
        <BrowserInput
          filters={[{ name: 'ROM', extensions: ['smc'] }]}
          mode='file'
          onBlur={romFilePath.field.handleBlur}
          onChange={romFilePath.field.handleChange}
          placeholder={romFilePath.field.control.label}
          value={romFilePath.field.value}
        />
      </FormControl>
    </SettingsGroup>
  );
}

export default forwardRef<NewProjectSettingsRef>(NewProjectSettings);
