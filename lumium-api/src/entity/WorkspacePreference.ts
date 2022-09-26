import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { Workspace } from "./Workspace";

export enum WorkspacePreferenceOption {
}

@Entity()
export class WorkspacePreference extends AbstractEntity {
    @ManyToOne(() => Workspace, (workspace) => workspace.preferences)
    workspace: Workspace

    @Column({
        type: "enum",
        enum: WorkspacePreferenceOption,
    })
    option: WorkspacePreferenceOption

    @Column()
    value: string
}
