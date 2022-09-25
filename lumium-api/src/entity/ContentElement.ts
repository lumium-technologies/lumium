import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PageContent } from "./PageContent";

export enum ContentType {
    MARKDOWN = 'markdown'
}

@Entity()
export class ContentElement {
    @PrimaryGeneratedColumn("uuid")
    id: string

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
