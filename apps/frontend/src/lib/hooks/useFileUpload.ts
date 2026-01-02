'use client';

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 200;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_FILE_TYPES = {
  'image/*': [],
  'video/*': [],
  'application/pdf': [],
};

export interface UseFileUploadOptions {
  onFileSelect: (files: File[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
}

export function useFileUpload({ onFileSelect, onError, multiple = true }: UseFileUploadOptions) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => {
        console.log('File type:', file.type);
      });
      onFileSelect(acceptedFiles);
    },
    [onFileSelect],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      fileRejections.forEach(({ errors, file }) => {
        errors.forEach(error => {
          let errorMessage = '';

          switch (error.code) {
            case 'file-too-large':
              errorMessage = `File "${file.name}" exceeds the maximum size of ${MAX_FILE_SIZE_MB}MB`;
              break;
            case 'file-invalid-type':
              errorMessage = `File "${file.name}" is not a valid type. Only images, videos, and PDFs are allowed.`;
              break;
            case 'too-many-files':
              errorMessage = 'Too many files selected. Please select one file at a time.';
              break;
            default:
              errorMessage = `Error uploading file "${file.name}": ${error.message}`;
          }

          if (onError) {
            onError(errorMessage);
          } else {
            console.error(errorMessage);
          }
        });
      });
    },
    [onError],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple,
    onDropAccepted,
    onDropRejected,
  });

  const FileInput: ReactElement = useMemo(() => {
    const inputProps = getInputProps();
    return React.createElement('input', inputProps);
  }, [getInputProps]);

  return {
    getRootProps,
    getInputProps,
    FileInput,
    isDragActive,
    acceptedFiles,
    fileRejections,
  };
}
