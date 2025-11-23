import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity";

export enum ConfirmationType {
	PASSWORD_RESET = "password_reset",
	EMAIL_VERIFY = "email_verify",
}

@Entity("confirmations")
@Index(["userId", "type"])
export class Confirmation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column({
		type: "enum",
		enum: ConfirmationType,
	})
	type: ConfirmationType;

	@Column({ nullable: true })
	code?: string;

	@Column({ nullable: true })
	token?: string;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user: User;

	@CreateDateColumn()
	createdAt: Date;
}

