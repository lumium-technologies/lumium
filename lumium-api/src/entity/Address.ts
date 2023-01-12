import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { AddressDTO } from "../../types/api/v1/response/AddressDTO";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

export enum AddressKind {
    RESIDENTIAL = "residential",
    BILLING = "billing"
}

// Addresses as specified under 'Generic Formats':
// https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php
@Entity('adresses')
@Unique(["user", "kind"])
export class Address extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.addresses, { cascade: true, onDelete: 'CASCADE' })
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

export const mapToAddressDTO = (entity: Address) => {
    let dto: AddressDTO = {
        userId: entity.user?.id,
        kind: entity.kind?.toString(),
        fullName: entity.fullName,
        lineOne: entity.lineOne,
        lineTwo: entity.lineTwo,
        city: entity.city,
        state: entity.state,
        postalCode: entity.postalCode,
        country: entity.country,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
