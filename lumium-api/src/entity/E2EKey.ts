import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKeyVariant } from "./E2EKeyVariant";
import { Workspace } from "./Workspace";

@Entity()
export class E2EKey extends AbstractEntity {
    @OneToOne(() => Workspace, (workspace) => workspace.key, {cascade: true, onDelete: 'CASCADE'})
    workspace: Workspace

    @OneToMany(() => E2EKeyVariant, (variant) => variant.key)
    keys: E2EKeyVariant[]
}
