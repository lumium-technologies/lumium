import { PrimaryGeneratedColumn, CreateDateColumn, Timestamp, UpdateDateColumn, DeleteDateColumn, VersionColumn } from 'typeorm';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string

    @CreateDateColumn({type: 'timestamptz'})
    createdAt?: Timestamp

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt?: Timestamp

    @DeleteDateColumn({type: 'timestamptz'})
    deletedAt?: Timestamp

    @VersionColumn({default: 0})
    version?: number
}
