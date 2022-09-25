import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { Address } from "./Address"
import { Email } from "./Email"

@Entity()
export class User {
    // SuperTokens generates this uuid, for consistency and simplicity we make sure to utilize the same value, and not generate a new one
    @PrimaryColumn("uuid")
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    nickname: string

    @Column()
    birthday: Date

    @OneToMany(() => Email, (email) => email.user)
    emails: Email[]

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[]
}
