import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

@Entity("authentication_information")
export class AuthenticationInformation extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.auth)
    user: User

    @Column()
    variant: string
}
