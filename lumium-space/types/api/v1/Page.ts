import { AbstractDTO } from "./AbstractDTO";
import { PageContent } from "./PageContent";

export interface Page extends AbstractDTO {
    workspaceId: string;
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    contents: PageContent[];

}