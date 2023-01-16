import { Entity, Column, OneToMany, ManyToMany, OneToOne, ManyToOne, JoinColumn } from "typeorm"
import { UserDTO } from "../../types/api/v1/response/UserDTO"
import { AbstractEntity } from "./AbstractEntity"
import { Address } from "./Address"
import { AuthenticationInformation } from "./AuthenticationInformation"
import { BlacklistedToken } from "./BlacklistedToken"
import { Email, mapToEmailDTO } from "./Email"
import { mapToPageDTO, Page } from "./Page"
import { mapToUserPreferenceDTO, UserPreference } from "./UserPreference"
import { mapToWorkspaceDTO, Workspace } from "./Workspace"

@Entity("users")
export class User extends AbstractEntity {
    @OneToOne(() => AuthenticationInformation, (auth) => auth.user, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    auth?: AuthenticationInformation

    @OneToMany(() => BlacklistedToken, (token) => token.user)
    blacklistedTokens?: BlacklistedToken[]

    @Column({ nullable: true })
    firstName?: string

    @Column({ nullable: true })
    lastName?: string

    @Column({ unique: true })
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

export const mapToUserDTO = (entity: User) => {
    let dto: UserDTO = {
        firstName: entity.firstName,
        lastName: entity.lastName,
        nickName: entity.nickName,
        birthday: entity.birthday?.toUTCString(),
        emails: entity.emails?.map(mapToEmailDTO),
        ownedWorkspaces: entity.ownedWorkspaces?.map(mapToWorkspaceDTO),
        administratedWorkspaces: entity.administratedWorkspaces?.map(mapToWorkspaceDTO),
        visitorWorkspaces: entity.visitorWorkspaces?.map(mapToWorkspaceDTO),
        ownedPages: entity.ownedPages?.map(mapToPageDTO),
        administratedPages: entity.administratedPages?.map(mapToPageDTO),
        memberPages: entity.memberPages?.map(mapToPageDTO),
        visitorPages: entity.visitorPages?.map(mapToPageDTO),
        preferences: entity.preferences?.map(mapToUserPreferenceDTO),
        recentWorkspace: entity.recentWorkspace && mapToWorkspaceDTO(entity.recentWorkspace),
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
