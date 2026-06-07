import { useDraggable } from '@dnd-kit/core';

import { FileResponse } from '@/lib/api/file.api';

import { File, FileHoverOverlay, Thumbnail, Title } from './styled';

interface FileCardProps {
  file: FileResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const FileCard = ({ file, isSelected, onClick }: FileCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `file-${file.fileId}`,
    data: { type: 'file', fileId: file.fileId },
  });

  return (
    <File
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
      $isSelected={isSelected}
      style={{ touchAction: 'none', opacity: isDragging ? 0.4 : 1 }}
    >
      <FileHoverOverlay $isSelected={isSelected} />
      <Title>{file.filename}</Title>
      <Thumbnail
        src={file.thumbnailUrl ?? ''}
        alt={file.filename ?? ''}
        width={file.thumbnailWidth ?? 500}
        height={file.thumbnailHeight ?? 500}
      />
    </File>
  );
};
