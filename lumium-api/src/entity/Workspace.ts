import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey } from "./E2EKey";
import { Page } from "./Page";
import { User } from "./User";
import { WorkspacePreference } from "./WorkspacePreference";

@Entity()
export class Workspace extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.ownedWorkspaces, {cascade: true, onDelete: 'CASCADE'})
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
    key: E2EKey
}
