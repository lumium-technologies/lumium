import { AbstractEntityDTO } from "./AbstractEntityDTO";
import { PageContentDTO } from "./PageContentDTO";

export interface PageDTO extends AbstractEntityDTO {
    workspaceId: string;
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    contents: PageContentDTO[];
}
