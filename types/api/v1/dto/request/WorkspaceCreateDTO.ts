import { E2EKeyCreateDTO } from "./E2EKeyCreateDTO";

export interface WorkspaceCreateDTO {
    name: string;
    key: E2EKeyCreateDTO;
}
