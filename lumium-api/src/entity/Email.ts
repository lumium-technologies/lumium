import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

@Entity('emails')
@Unique(['user', 'primary'])
export class Email extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.emails, {cascade: true, onDelete: 'CASCADE'})
    user: User

    @Column({unique: true})
    email: string

    @Column({nullable: true})
    primary?: boolean

    @Column({default: false})
    verified?: boolean
}
