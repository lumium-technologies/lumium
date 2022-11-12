import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey } from "./E2EKey";

@Entity('end_to_end_key_variants')
export class E2EKeyVariant extends AbstractEntity {
    @ManyToOne(() => E2EKey, (key) => key.keys, {cascade: true, onDelete: 'CASCADE'})
    key: E2EKey

    @Column()
    activator: string

    @Column()
    activatorNonce: string

    @Column()
    value: string

    @Column()
    valueNonce: string

    @Column({default: true})
    active?: boolean
}
