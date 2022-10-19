import { AbstractEntityDTO } from './AbstractEntityDTO';

export interface AddressDTO extends AbstractEntityDTO {
    userId: string;
    kind: string;
    fullName: string;
    lineOne: string;
    lineTwo: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
