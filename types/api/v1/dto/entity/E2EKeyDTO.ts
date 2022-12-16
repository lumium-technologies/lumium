import { AbstractEntityDTO } from "./AbstractEntityDTO";
import { E2EKeyVariantDTO } from "./E2EKeyVariantDTO";

export interface E2EKeyDTO extends AbstractEntityDTO {
    workspaceId: string;
    activator: string;
    keys: E2EKeyVariantDTO[];
}
