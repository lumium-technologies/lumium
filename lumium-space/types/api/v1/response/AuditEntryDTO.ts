import { AbstractEntityDTO } from './AbstractEntityDTO';

export interface AuditEntryDTO extends AbstractEntityDTO {
    userId: string;
    type: string;
    level: string;
    detail: string;
}
