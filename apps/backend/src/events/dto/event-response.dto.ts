export class EventResponseDto {
  eventID: string;
  name: string;
  isDefault: boolean;
  uploadToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
