import { Column, Entity, ManyToOne } from "typeorm";
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
