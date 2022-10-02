import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface ContentElementDTO extends AbstractEntityDTO {
    content: string;
    pageContents: string[];
    type: string;
};
