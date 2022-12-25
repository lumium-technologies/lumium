import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { PageDTO } from "../../types";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity('pages')
export class Page extends AbstractEntity {
    @ManyToOne(() => Workspace, (workspace) => workspace.pages, { cascade: true, onDelete: 'CASCADE' })
    workspace: Workspace

    @ManyToOne(() => User, (user) => user.ownedPages)
    owner: User

    @ManyToMany(() => User, (user) => user.administratedPages)
    @JoinTable()
    admins: User[]

    @ManyToMany(() => User, (user) => user.memberPages)
    @JoinTable()
    members: User[]

    @ManyToMany(() => User, (user) => user.visitorPages)
    @JoinTable()
    visitors: User[]

    @Column()
    content: string

    @Column({ unique: true })
    name: string
}

export const mapToPageDTO = (entity: Page) => {
    let dto: PageDTO = {
        workspaceId: entity.workspace?.id,
        ownerId: entity.owner?.id,
        admins: entity.admins?.map(t => t.id),
        members: entity.members?.map(t => t.id),
        visitors: entity.visitors?.map(t => t.id),
        content: entity.content,
        name: entity.name,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
