import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { WorkspaceCreateDTO, WorkspaceDTO } from "../../types";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey, mapToE2EKey, mapToE2EKeyDTO } from "./E2EKey";
import { mapToPageDTO, Page } from "./Page";
import { User } from "./User";
import { mapToWorkspacePreferenceDTO, WorkspacePreference } from "./WorkspacePreference";

@Entity('workspaces')
export class Workspace extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.ownedWorkspaces, { cascade: true, onDelete: 'CASCADE' })
    owner: User

    @ManyToMany(() => User, (user) => user.administratedWorkspaces)
    @JoinTable()
    admins: User[]

    @ManyToMany(() => User, (user) => user.memberWorkspaces)
    @JoinTable()
    members: User[]

    @ManyToMany(() => User, (user) => user.visitorWorkspaces)
    @JoinTable()
    visitors: User[]

    @OneToMany(() => Page, (page) => page.workspace)
    pages: Page[]

    @OneToMany(() => WorkspacePreference, (workspacePreferences) => workspacePreferences.workspace)
    preferences: WorkspacePreference[]

    @OneToOne(() => E2EKey, (e2eKey) => e2eKey.workspace)
    @JoinColumn()
    key: E2EKey

    @Column({ unique: true })
    name: string
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

export const mapToWorkspace = (dto: WorkspaceCreateDTO) => {
    let entity: Workspace = {
        owner: null,
        admins: null,
        members: null,
        visitors: null,
        pages: null,
        preferences: null,
        key: mapToE2EKey(dto.key),
        name: dto.name
    };
    return entity;
};
