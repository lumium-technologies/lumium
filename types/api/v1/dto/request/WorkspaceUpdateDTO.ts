export interface WorkspaceUpdateDTO {
    id: string;
    ownerId: string;
    admins: string[];
    members: string[];
    visitors: string[];
    name: string;
}
