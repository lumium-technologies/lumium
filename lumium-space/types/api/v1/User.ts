import { UserPreferences } from "typescript";
import { AbstractDTO } from "./AbstractDTO";
import { Email } from "./Email";
import { Page } from "./Page";
import { Workspace } from "./Workspace";

export interface User extends AbstractDTO {
    firstName: string;
    lastName: string;
    nickName: string;
    birthday: string;
    emails: Email[];
    ownedWorkspaces: Workspace[];
    administratedWorkspaces: Workspace[];
    visitorWorkspaces: Workspace[];
    ownedPages: Page[];
    administratedPages: Page[];
    memberPages: Page[];
    visitorPages: Page[];
    preferences: UserPreferences[];
}