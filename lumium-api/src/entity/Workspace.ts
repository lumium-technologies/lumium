import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { WorkspaceCreateDTO } from "../../types/api/v1/create/WorkspaceCreateDTO";
import { WorkspaceDTO } from "../../types/api/v1/response/WorkspaceDTO";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey, mapCreateToE2EKey, mapToE2EKeyDTO } from "./E2EKey";
import { mapToPageDTO, Page } from "./Page";
import { User } from "./User";
import { mapToWorkspacePreferenceDTO, WorkspacePreference } from "./WorkspacePreference";
import { WorkspaceSecret } from "./WorkspaceSecret";

@Entity('workspaces')
export class Workspace extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.ownedWorkspaces, { cascade: true, onDelete: 'CASCADE' })
    owner: User

    @ManyToMany(() => User, (user) => user.administratedWorkspaces)
    @JoinTable()
    admins?: User[]

    @ManyToMany(() => User, (user) => user.memberWorkspaces)
    @JoinTable()
    members?: User[]

    @ManyToMany(() => User, (user) => user.visitorWorkspaces)
    @JoinTable()
    visitors?: User[]

    @OneToMany(() => Page, (page) => page.workspace)
    pages?: Page[]

    @OneToMany(() => WorkspacePreference, (workspacePreferences) => workspacePreferences.workspace)
    preferences?: WorkspacePreference[]

    @OneToOne(() => E2EKey, (e2eKey) => e2eKey.workspace)
    @JoinColumn()
    key: E2EKey

    @Column({ unique: true })
    name: string

    @OneToMany(() => WorkspaceSecret, (secret) => secret.workspace)
    secrets?: WorkspaceSecret[]
}

export const mapToWorkspaceDTO = (entity: Workspace) => {
    let dto: WorkspaceDTO = {
        ownerId: entity.owner?.id,
        admins: entity.admins?.map(t => t.id),
        visitors: entity.visitors?.map(t => t.id),
        members: entity.members?.map(t => t.id),
        pages: entity.pages?.map(mapToPageDTO),
        preferences: entity.preferences?.map(mapToWorkspacePreferenceDTO),
        name: entity.name,
        key: entity.key && mapToE2EKeyDTO(entity.key),
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};

export const mapCreateToWorkspace = (dto: WorkspaceCreateDTO) => {
    let entity: Workspace = {
        owner: null,
        key: mapCreateToE2EKey(dto.key),
        name: dto.name,
    };
    return entity;
};
