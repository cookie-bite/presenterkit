import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import { Event } from "./event.entity";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 30 })
	username: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
	refreshTokens: RefreshToken[];

	@OneToMany(() => Event, (event) => event.user)
	events: Event[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
