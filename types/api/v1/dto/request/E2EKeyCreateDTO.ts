import { E2EKeyVariantCreateDTO } from './E2EKeyVariantCreateDTO';

export interface E2EKeyCreateDTO {
    keys: E2EKeyVariantCreateDTO[];
    activator: string;
}
