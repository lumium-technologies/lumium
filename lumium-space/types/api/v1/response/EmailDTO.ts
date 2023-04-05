import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface EmailDTO extends AbstractEntityDTO {
    userId: string;
    email: string;
    primary: boolean;
    verified: boolean;
}
