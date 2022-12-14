import { Column, Entity, OneToMany } from "typeorm";
import { ContentElementDTO } from "../../types";
import { AbstractEntity } from "./AbstractEntity";
import { PageContent } from "./PageContent";

export enum ContentType {
    MARKDOWN = 'markdown'
}

@Entity('content_elements')
export class ContentElement extends AbstractEntity {
    @Column()
    content: string

    @OneToMany(() => PageContent, (pageContent) => pageContent.contentElement)
    pageContents: PageContent[]

    @Column({
        type: "enum",
        enum: ContentType,
        default: ContentType.MARKDOWN
    })
    type: ContentType
}

export const mapToContentElementDTO = (entity: ContentElement) => {
    let dto: ContentElementDTO = {
        content: entity.content,
        pageContents: entity.pageContents?.map(t => t.id),
        type: entity.type,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
