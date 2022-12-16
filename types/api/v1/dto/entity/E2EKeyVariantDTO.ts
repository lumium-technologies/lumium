import { AbstractEntityDTO } from "./AbstractEntityDTO";

export interface E2EKeyVariantDTO extends AbstractEntityDTO {
    keyId: string;
    activator: string;
    activatorNonce: string;
    value: string;
    valueNonce: string;
    active: boolean;
};
