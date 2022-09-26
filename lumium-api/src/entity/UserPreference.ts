import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { User } from "./User";

export enum UserPreferenceOption {
    COLOR_MODE = "color_mode"
}

@Entity()
export class UserPreference extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.preferences, {cascade: true})
    user: User

    @Column({
        type: "enum",
        enum: UserPreferenceOption,
    })
    option: UserPreferenceOption

    @Column()
    value: string
}
