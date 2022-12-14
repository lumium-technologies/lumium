import { AbstractEntityDTO } from "./AbstractEntityDTO";
import { ContentElementDTO } from "./ContentElementDTO";

export interface PageContentDTO extends AbstractEntityDTO {
    pageId: string;
    position: number;
    contentElement: ContentElementDTO;
}
