import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { PageCreateDTO, PageDTO, PageUpdateDTO } from "../../types";
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

export const mapCreateToPage = (dto: PageCreateDTO, ownerId: string) => {
    let workspace = new Workspace();
    workspace.id = dto.workspaceId;
    let owner = new User();
    owner.id = ownerId;
    let entity = new Page();
    entity.name = dto.name; entity.workspace = workspace;
    entity.owner = owner;
    return entity;
};

export const mapUpdateToPage = (dto: PageUpdateDTO) => {
    let entity = new Page();
    entity.id = dto.id;
    entity.name = dto.name;
    entity.content = dto.content;
    let owner = new User();
    owner.id = dto.ownerId;
    entity.owner = owner;
    entity.admins = dto.adminIds?.map(t => { let u = new User(); u.id = t; return u; });
    entity.members = dto.memberIds?.map(t => { let u = new User(); u.id = t; return u; });
    entity.visitors = dto.visitorIds?.map(t => { let u = new User(); u.id = t; return u; });
    return entity;
};
