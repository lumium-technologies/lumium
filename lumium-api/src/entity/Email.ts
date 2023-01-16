import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { EmailDTO } from "../../types/api/v1/response/EmailDTO";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

@Entity('emails')
@Unique(['user', 'primary'])
export class Email extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.emails, { cascade: true, onDelete: 'CASCADE' })
    user: User

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    primary?: boolean

    @Column({ default: false })
    verified?: boolean
}

export const mapToEmailDTO = (entity: Email) => {
    let dto: EmailDTO = {
        userId: entity.user?.id,
        email: entity.email,
        primary: entity.primary,
        verified: entity.verified,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
