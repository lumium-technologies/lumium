import { E2EKeyCreateDTO } from "./E2EKeyCreateDTO";

export interface WorkspaceCreateDTO {
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    name: string;
    key: E2EKeyCreateDTO;
}
