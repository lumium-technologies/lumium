import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Page } from "./Page";
import { User } from "./User";
import { WorkspacePreferences } from "./WorkspacePreferences";

@Entity()
export class Workspace {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.ownedWorkspaces)
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

    @OneToMany(() => WorkspacePreferences, (workspacePreferences) => workspacePreferences.workspace)
    preferences: WorkspacePreferences[]
}
