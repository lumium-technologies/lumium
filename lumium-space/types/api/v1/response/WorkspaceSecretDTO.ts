import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface WorkspaceSecretDTO extends AbstractEntityDTO {
    userId: string;
    workspaceId: string;
    secret: string;
}
