import { Column, Entity, ManyToOne, Timestamp } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

@Entity("blacklisted_tokens")
export class BlacklistedToken extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.blacklistedTokens, { cascade: true, onDelete: 'CASCADE' })
    user: User

    @Column()
    token: string

    @Column({ type: "bigint" })
    expires: number
}
