import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface PageDTO extends AbstractEntityDTO {
    workspaceId: string;
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    content: string;
    name: string;
}
