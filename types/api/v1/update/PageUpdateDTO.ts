export interface PageUpdateDTO {
    id: string;
    name?: string;
    content?: string;
    ownerId?: string;
    adminIds?: string[];
    memberIds?: string[];
    visitorIds?: string[];
}
