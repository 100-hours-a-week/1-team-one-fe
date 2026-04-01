import { useState } from 'react';

import {
  requestProfileImageUploadUrlFn,
  uploadToPresignedPutFn,
} from '@/src/entities/image-upload';

import { PROFILE_EDIT_MESSAGES } from '../config/edit-messages';

interface UploadState {
  file: File | null;
  filePath: string | null;
  isUploading: boolean;
  error: string | null;
}

export function useProfileImageUpload() {
  const [state, setState] = useState<UploadState>({
    file: null,
    filePath: null,
    isUploading: false,
    error: null,
  });

  const uploadFile = async (file: File) => {
    setState((s) => ({ ...s, file, isUploading: true, error: null, filePath: null }));

    try {
      const { uploadUrl, filePath } = await requestProfileImageUploadUrlFn({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      });
      await uploadToPresignedPutFn(uploadUrl, file, file.type);
      setState((s) => ({ ...s, filePath, isUploading: false }));
    } catch {
      setState((s) => ({
        ...s,
        isUploading: false,
        error: PROFILE_EDIT_MESSAGES.IMAGE_UPLOAD_FAILED,
      }));
    }
  };

  const reset = () => setState({ file: null, filePath: null, isUploading: false, error: null });

  return { ...state, uploadFile, reset };
}
