import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkspacePreferenceDTO } from "../../types";
import { AbstractEntity } from "./AbstractEntity";
import { Workspace } from "./Workspace";

export enum WorkspacePreferenceOption {
}

@Entity('workspace_preferences')
export class WorkspacePreference extends AbstractEntity {
    @ManyToOne(() => Workspace, (workspace) => workspace.preferences, { cascade: true, onDelete: 'CASCADE' })
    workspace: Workspace

    @Column({
        type: "enum",
        enum: WorkspacePreferenceOption,
    })
    option: WorkspacePreferenceOption

    @Column()
    value: string
}

export const mapToWorkspacePreferenceDTO = (entity: WorkspacePreference) => {
    let dto: WorkspacePreferenceDTO = {
        workspaceId: entity.workspace.id,
        option: entity.option.toString(),
        value: entity.value,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
