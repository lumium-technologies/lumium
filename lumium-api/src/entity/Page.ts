import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { PageContent } from "./PageContent";
import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity()
export class Page extends AbstractEntity {
    @ManyToOne(() => Workspace, (workspace) => workspace.pages, {cascade: true, onDelete: 'CASCADE'})
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

    @OneToMany(() => PageContent, (pageContent) => pageContent.page)
    contents: PageContent[]
}
