import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workspace } from "./Workspace";

export enum WorkspacePreferenceOption {
}

@Entity()
export class WorkspacePreference {
    @PrimaryGeneratedColumn("uuid")
    id: string

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
