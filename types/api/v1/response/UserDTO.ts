import { AbstractEntityDTO } from "./AbstractEntityDTO";
import { EmailDTO } from "./EmailDTO";
import { PageDTO } from "./PageDTO";
import { UserPreferenceDTO } from "./UserPreferenceDTO";
import { WorkspaceDTO } from "./WorkspaceDTO";

export interface UserDTO extends AbstractEntityDTO {
    firstName: string;
    lastName: string;
    nickName: string;
    birthday: string;
    emails: EmailDTO[];
    ownedWorkspaces: WorkspaceDTO[];
    administratedWorkspaces: WorkspaceDTO[];
    visitorWorkspaces: WorkspaceDTO[];
    ownedPages: PageDTO[];
    administratedPages: PageDTO[];
    memberPages: PageDTO[];
    visitorPages: PageDTO[];
    preferences: UserPreferenceDTO[];
    recentWorkspace: WorkspaceDTO;
}