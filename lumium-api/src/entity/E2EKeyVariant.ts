import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { E2EKey } from "./E2EKey";

@Entity()
export class E2EKeyVariant extends AbstractEntity {
    @ManyToOne(() => E2EKey, (key) => key.keys, {cascade: true, onDelete: 'CASCADE'})
    key: E2EKey

    @Column()
    activator: string

    @Column()
    value: string

    @Column({default: true})
    active: boolean
}
