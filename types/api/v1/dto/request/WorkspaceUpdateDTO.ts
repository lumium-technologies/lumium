import { PageDTO } from "../entity/PageDTO";
import { WorkspacePreferenceDTO } from "../entity/WorkspacePreferenceDTO";

export interface WorkspaceUpdateDTO {
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    pages: PageDTO[];
    preferences: WorkspacePreferenceDTO[];
}
