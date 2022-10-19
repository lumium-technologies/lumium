import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { ContentElement } from "./ContentElement";
import { Page } from "./Page";

@Entity('page_contents')
export class PageContent extends AbstractEntity {
    @ManyToOne(() => Page, (page) => page.contents, {cascade: true, onDelete: 'CASCADE'})
    page: Page

    @Column()
    position: number

    @ManyToOne(() => ContentElement, (contentElement) => contentElement.pageContents)
    contentElement: ContentElement
}
