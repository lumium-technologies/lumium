import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { E2EKeyCreateDTO } from "../../types/api/v1/create/E2EKeyCreateDTO";
import { E2EKeyDTO } from "../../types/api/v1/response/E2EKeyDTO";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKeyVariant, mapCreateToE2EKeyVariant, mapToE2EKeyVariantDTO } from "./E2EKeyVariant";
import { Workspace } from "./Workspace";

@Entity('end_to_end_keys')
export class E2EKey extends AbstractEntity {
    @OneToOne(() => Workspace, (workspace) => workspace.key, { cascade: true, onDelete: 'CASCADE' })
    workspace?: Workspace

    @OneToMany(() => E2EKeyVariant, (variant) => variant.key, { eager: true })
    keys: E2EKeyVariant[]

    @Column()
    activator: string
}

export const mapToE2EKeyDTO = (entity: E2EKey) => {
    let dto: E2EKeyDTO = {
        workspaceId: entity.workspace?.id,
        keys: entity.keys?.map(mapToE2EKeyVariantDTO),
        activator: entity.activator,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
}

export const mapCreateToE2EKey = (dto: E2EKeyCreateDTO) => {
    let entity: E2EKey = {
        keys: dto.keys.map(mapCreateToE2EKeyVariant),
        activator: dto.activator
    };
    return entity;
};
