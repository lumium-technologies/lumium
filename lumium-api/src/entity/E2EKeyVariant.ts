import { Column, Entity, ManyToOne } from "typeorm";
import { E2EKeyVariantCreateDTO } from "../../types/api/v1/create/E2EKeyVariantCreateDTO";
import { E2EKeyVariantDTO } from "../../types/api/v1/response/E2EKeyVariantDTO";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey } from "./E2EKey";

@Entity('end_to_end_key_variants')
export class E2EKeyVariant extends AbstractEntity {
    @ManyToOne(() => E2EKey, (key) => key.keys, { cascade: true, onDelete: 'CASCADE' })
    key?: E2EKey

    @Column()
    activator: string

    @Column()
    activatorNonce: string

    @Column()
    value: string

    @Column()
    valueNonce: string

    @Column({ default: true })
    active?: boolean
}

export const mapToE2EKeyVariantDTO = (entity: E2EKeyVariant) => {
    let dto: E2EKeyVariantDTO = {
        keyId: entity.key?.id,
        activator: entity.activator,
        activatorNonce: entity.activatorNonce,
        value: entity.value,
        valueNonce: entity.valueNonce,
        active: entity.active,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};

export const mapCreateToE2EKeyVariant = (dto: E2EKeyVariantCreateDTO) => {
    let entity: E2EKeyVariant = {
        activator: dto.activator,
        activatorNonce: dto.activatorNonce,
        value: dto.value,
        valueNonce: dto.valueNonce,
    };
    return entity;
};
