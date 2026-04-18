import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  eventId: number;

  @ManyToOne(() => Event, event => event.files, { onDelete: 'CASCADE' })
  event: Event;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.UPLOADING,
  })
  status: FileStatus;

  @Column({ nullable: true, type: 'varchar' })
  blobUrl: string;

  @Column()
  blobPath: string;

  @Column({ nullable: true, type: 'varchar' })
  storageKey: string | null;

  @Column({ nullable: true, type: 'int' })
  pageCount: number | null;

  @Column({ nullable: true, type: 'varchar' })
  thumbnailUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
