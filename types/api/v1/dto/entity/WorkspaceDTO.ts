import { AbstractEntityDTO } from "./AbstractEntityDTO";
import { PageDTO } from "./PageDTO";
import { WorkspacePreferenceDTO } from "./WorkspacePreferenceDTO";

export interface WorkspaceDTO extends AbstractEntityDTO {
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    pages: PageDTO[];
    preferences: WorkspacePreferenceDTO[];
}
