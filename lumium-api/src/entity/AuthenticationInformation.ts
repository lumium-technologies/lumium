import { Column, Entity, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

@Entity("authentication_information")
export class AuthenticationInformation extends AbstractEntity {
    @OneToOne(() => User, (user) => user.auth)
    user: User

    @Column()
    variant: string
}
