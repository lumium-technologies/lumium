import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { ContentElement } from "./ContentElement";
import { Page } from "./Page";

@Entity()
export class PageContent extends AbstractEntity {
    @ManyToOne(() => Page, (page) => page.contents)
    page: Page

    @Column()
    position: number

    @ManyToMany(() => ContentElement, (contentElement) => contentElement.pageContents)
    @JoinTable()
    contentElements: ContentElement[]
}
