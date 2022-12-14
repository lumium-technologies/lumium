import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKeyVariant } from "./E2EKeyVariant";
import { Workspace } from "./Workspace";

@Entity('end_to_end_keys')
export class E2EKey extends AbstractEntity {
    @OneToOne(() => Workspace, (workspace) => workspace.key)
    workspace: Workspace

    @OneToMany(() => E2EKeyVariant, (variant) => variant.key)
    keys?: E2EKeyVariant[]

    @Column()
    activator: string
}
