import { Entity, Column, ManyToOne } from 'typeorm';
import { AuditEntryDTO } from '../../types/api/v1/response/AuditEntryDTO';
import { AbstractEntity } from './AbstractEntity';
import { User } from './User';

export enum AuditEntryEvent {
    USER_SIGN_UP = 'user_sign_up',
    USER_SIGN_IN = 'user_sign_in',
    USER_SIGN_OUT = 'user_sign_out',
    FAILED_LOGIN_ATTEMPT = 'failed_login_attempt',
    FAILED_AUTH_ATTEMPT = 'failed_auth_attempt',
    UNAUTHORIZED_WORKSPACE_GET_ATTEMPT = 'unauthorized_workspace_get_attempt',
    UNAUTHORIZED_WORKSPACE_PATCH_ATTEMPT = 'unauthorized_workspace_patch_attempt',
    UNAUTHORIZED_WORKSPACE_POST_ATTEMPT = 'unauthorized_workspace_post_attempt',
    UNAUTHORIZED_WORKSPACE_DELETE_ATTEMPT = 'unauthorized_workspace_delete_attempt',
    UNAUTHORIZED_PAGE_GET_ATTEMPT = 'unauthorized_page_get_attempt',
    UNAUTHORIZED_PAGE_PUT_ATTEMPT = 'unauthorized_page_put_attempt',
    UNAUTHORIZED_PAGE_PATCH_ATTEMPT = 'unauthorized_page_patch_attempt',
    UNAUTHORIZED_PAGE_POST_ATTEMPT = 'unauthorized_page_post_attempt',
    UNAUTHORIZED_PAGE_DELETE_ATTEMPT = 'unauthorized_page_delete_attempt'
}

export enum AuditEntryLevel {
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    FATAL = 'fatal'
}

@Entity('audit_log')
export class AuditEntry extends AbstractEntity {
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    user?: User;

    @Column({
        type: 'enum',
        enum: AuditEntryEvent,
    })
    type: AuditEntryEvent;

    @Column({
        type: 'enum',
        enum: AuditEntryLevel,
        default: AuditEntryLevel.INFO
    })
    level?: AuditEntryLevel;

    @Column({ nullable: true })
    detail?: string;
}

export const mapToAuditDTO = (entity: AuditEntry) => {
    let dto: AuditEntryDTO = {
        userId: entity.user?.id,
        type: entity.type?.toString(),
        level: entity.level?.toString(),
        detail: entity.detail,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
