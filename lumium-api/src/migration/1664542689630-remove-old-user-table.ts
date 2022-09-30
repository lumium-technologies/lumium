import { MigrationInterface, QueryRunner } from "typeorm"

export class removeOldUserTable1664542689630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table user`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table public."user" ( id uuid primary key not null default uuid_generate_v4(),"createdAt" timestamp with time zone not null default now(),"updatedAt" timestamp with time zone not null default now(),"deletedAt" timestamp with time zone,version integer not null default 0,"firstName" character varying,"lastName" character varying,"nickName" character varying,birthday timestamp without time zone`);
    }

}
