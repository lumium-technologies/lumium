import { AbstractDTO } from "./AbstractDTO";
import { Page } from "./Page";
import { WorkspacePreference } from "./WorkspacePreference";

export interface Workspace extends AbstractDTO {
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    pages: Page[];
    preferences: WorkspacePreference[];
}