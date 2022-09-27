export interface Email {
    id: string;
    userId: string;
    email: string;
    primary: boolean;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    version: number;
}