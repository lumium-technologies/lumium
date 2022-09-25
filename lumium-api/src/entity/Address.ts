import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

export enum AddressKind {
    RESIDENTIAL = "residential",
        BILLING = "billing"
}

// Addresses as specified under 'Generic Formats':
// https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php
@Entity()
@Unique(["user", "kind"])
export class Address {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.addresses)
    user: User

    @Column({
        type: "enum",
        enum: AddressKind,
        default: AddressKind.BILLING
    })
    kind: AddressKind

    @Column()
    fullName: string

    @Column()
    lineOne: string

    @Column()
    lineTwo: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    postalCode: string

    @Column()
    country: string
}
