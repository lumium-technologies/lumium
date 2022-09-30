import { AbstractDTO } from "./AbstractDTO";

export interface UserPreference extends AbstractDTO {
    userId: string;
    option: string;
    value: string;
}