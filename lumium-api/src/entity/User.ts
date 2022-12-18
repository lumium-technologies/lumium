import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany, OneToOne, ManyToOne } from "typeorm"
import { AbstractEntity } from "./AbstractEntity"
import { Address } from "./Address"
import { AuthenticationInformation } from "./AuthenticationInformation"
import { Email } from "./Email"
import { Page } from "./Page"
import { UserPreference } from "./UserPreference"
import { Workspace } from "./Workspace"

@Entity("users")
export class User extends AbstractEntity {
    @OneToMany(() => AuthenticationInformation, (auth) => auth.user)
    auth?: AuthenticationInformation[]

    @Column({ nullable: true })
    firstName?: string

    @Column({ nullable: true })
    lastName?: string

    @Column({ nullable: true })
    nickName?: string

    @Column({ nullable: true })
    birthday?: Date

    @OneToMany(() => Email, (email) => email.user)
    emails?: Email[]

    @OneToMany(() => Address, (address) => address.user)
    addresses?: Address[]

    @OneToMany(() => Workspace, (workspace) => workspace.owner)
    ownedWorkspaces?: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.admins)
    administratedWorkspaces?: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.members)
    memberWorkspaces?: Workspace[]

    @ManyToMany(() => Workspace, (workspace) => workspace.visitors)
    visitorWorkspaces?: Workspace[]

    @OneToMany(() => Page, (page) => page.owner)
    ownedPages?: Page[]

    @ManyToMany(() => Page, (page) => page.admins)
    administratedPages?: Page[]

    @ManyToMany(() => Page, (page) => page.members)
    memberPages?: Page[]

    @ManyToMany(() => Page, (page) => page.visitors)
    visitorPages?: Page[]

    @OneToMany(() => UserPreference, (userPreferences) => userPreferences.user)
    preferences?: UserPreference[]

    @ManyToOne(() => Workspace, { nullable: true, onDelete: "SET NULL" })
    recentWorkspace?: Workspace
}
