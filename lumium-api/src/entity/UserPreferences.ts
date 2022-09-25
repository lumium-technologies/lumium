import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum UserPreferenceOption {
    COLOR_MODE = "color_mode"
}

@Entity()
export class UserPreferences {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.preferences)
    user: User

    @Column({
        type: "enum",
        enum: UserPreferenceOption,
    })
    option: UserPreferenceOption

    @Column()
    value: string
}
