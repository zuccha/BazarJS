import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toolchain } from '../../../core/Toolchain';
import { AppDispatch, AppState } from '../../../store';
import { getToolchain } from '../../../store/slices/core/slices/toolchain';
import { ErrorReport } from '../../../utils/ErrorReport';

export default function useDownloadToolEmbedded({
  name,
  key,
  download,
}: {
  name: string;
  key: keyof Toolchain['embedded'];
  download: () => (
    dispatch: AppDispatch,
    getState: () => AppState,
  ) => Promise<ErrorReport | undefined>;
}): [() => void, 'downloading' | 'installed' | 'not-installed' | 'deprecated'] {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const toolchain = useSelector(getToolchain());

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await dispatch(download()).then((error: ErrorReport | undefined) => {
      if (error) {
        toast({
          title: `Failed to download ${name}`,
          description: error.main,
          status: 'error',
        });
      }
    });
    setIsDownloading(false);
  };

  const status = isDownloading ? 'downloading' : toolchain.embedded[key].status;

  return [handleDownload, status];
}
