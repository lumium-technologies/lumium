import { Column, Entity, ManyToOne } from "typeorm";
import { PageContentDTO } from "../../types";
import { AbstractEntity } from "./AbstractEntity";
import { ContentElement, mapToContentElementDTO } from "./ContentElement";
import { Page } from "./Page";

@Entity('page_contents')
export class PageContent extends AbstractEntity {
    @ManyToOne(() => Page, (page) => page.contents, { cascade: true, onDelete: 'CASCADE' })
    page: Page

    @Column()
    position: number

    @ManyToOne(() => ContentElement, (contentElement) => contentElement.pageContents)
    contentElement: ContentElement
}

export const mapToPageContentDTO = (entity: PageContent) => {
    let dto: PageContentDTO = {
        pageId: entity.page.id,
        position: entity.position,
        contentElement: mapToContentElementDTO(entity.contentElement),
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
