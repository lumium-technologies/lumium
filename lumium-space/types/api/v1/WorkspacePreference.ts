import { AbstractDTO } from "./AbstractDTO";

export interface WorkspacePreference extends AbstractDTO {
    workspaceId: string;
    option: string;
    value: string;
}