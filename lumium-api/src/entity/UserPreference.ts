import { Column, Entity, ManyToOne } from "typeorm";
import { UserPreferenceDTO } from "../../types/api/v1/response/UserPreferenceDTO";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

export enum UserPreferenceOption {
    COLOR_MODE = "color_mode"
}

@Entity('user_preferences')
export class UserPreference extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.preferences, { cascade: true, onDelete: 'CASCADE' })
    user: User

    @Column({
        type: "enum",
        enum: UserPreferenceOption,
    })
    option: UserPreferenceOption

    @Column()
    value: string
}

export const mapToUserPreferenceDTO = (entity: UserPreference) => {
    let dto: UserPreferenceDTO = {
        userId: entity.user?.id,
        option: entity.option?.toString(),
        value: entity.value,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
