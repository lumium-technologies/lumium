import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface WorkspacePreferenceDTO extends AbstractEntityDTO {
    workspaceId: string;
    option: string;
    value: string;
}
