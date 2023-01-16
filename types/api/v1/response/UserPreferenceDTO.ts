import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface UserPreferenceDTO extends AbstractEntityDTO {
    userId: string;
    option: string;
    value: string;
}
