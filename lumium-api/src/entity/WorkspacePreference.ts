import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { Workspace } from "./Workspace";

export enum WorkspacePreferenceOption {
}

@Entity('workspace_preferences')
export class WorkspacePreference extends AbstractEntity {
    @ManyToOne(() => Workspace, (workspace) => workspace.preferences, {cascade: true, onDelete: 'CASCADE'})
    workspace: Workspace

    @Column({
        type: "enum",
        enum: WorkspacePreferenceOption,
    })
    option: WorkspacePreferenceOption

    @Column()
    value: string
}
