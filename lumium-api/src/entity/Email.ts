import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

@Entity()
@Unique(['user', 'primary'])
export class Email {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.emails)
    user: User

    @Column({nullable: true})
    primary: boolean

    @Column({default: false})
    verified: boolean
}
