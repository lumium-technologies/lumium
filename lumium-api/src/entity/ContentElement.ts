import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { PageContent } from "./PageContent";

export enum ContentType {
    MARKDOWN = 'markdown'
}

@Entity()
export class ContentElement extends AbstractEntity {
    @Column()
    content: string

    @ManyToMany(() => PageContent, (pageContent) => pageContent.contentElements)
    pageContents: PageContent[]

    @Column({
        type: "enum",
        enum: ContentType,
        default: ContentType.MARKDOWN
    })
    type: ContentType
}
