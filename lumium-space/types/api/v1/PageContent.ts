import { AbstractDTO } from "./AbstractDTO";
import { ContentElement } from "./ContentElement";

export interface PageContent extends AbstractDTO {
    pageId: string;
    position: 0;
    contentElement: ContentElement;
}