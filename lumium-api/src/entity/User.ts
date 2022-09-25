import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { Address } from "./Address"
import { Email } from "./Email"
import { Page } from "./Page"
import { UserPreference } from "./UserPreference"
import { Workspace } from "./Workspace"

@Entity()
export class User {
    // SuperTokens generates this uuid, for consistency and simplicity we make sure to utilize the same value, and not generate a new one
    @PrimaryColumn("uuid")
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    nickname: string

    @Column()
    birthday: Date

    @OneToMany(() => Email, (email) => email.user)
    emails: Email[]

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[]

    @OneToMany(() => Workspace, (workspace) => workspace.owner)
    ownedWorkspaces: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.admins)
    administratedWorkspaces: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.members)
    memberWorkspaces: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.visitors)
    visitorWorkspaces: Workspace[]

    @OneToMany(() => Page, (page) => page.owner)
    ownedPages: Page[]

    @ManyToMany(() => Page, (page) => page.admins)
    administratedPages: Page[]

    @ManyToMany(() => Page, (page) => page.members)
    memberPages: Page[]

    @ManyToMany(() => Page, (page) => page.visitors)
    visitorPages: Page[]

    @OneToMany(() => UserPreference, (userPreferences) => userPreferences.user)
    preferences: UserPreference[]
}
