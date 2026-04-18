import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { File } from '../../files/entities/file.entity';

@Entity('events')
@Unique(['userId', 'eventID'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventID: string;

  @Column()
  name: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => File, file => file.event)
  files: File[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
