import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("events")
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	eventID: string;

	@Column()
	name: string;

	@ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
	user: User;

	@Column()
	userId: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

