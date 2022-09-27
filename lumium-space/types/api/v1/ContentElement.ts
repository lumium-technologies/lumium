import { AbstractDTO } from "./AbstractDTO";

export interface ContentElement extends AbstractDTO {
    content: string;
    pageContents: [
        string
    ];
    type: string;
};