import { MigrationInterface, QueryRunner } from "typeorm";

export class tokenBlacklistCascade1671441230539 implements MigrationInterface {
    name = 'tokenBlacklistCascade1671441230539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authentication_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "key" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "PK_591fa49b4252c7efee4b65077a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blacklisted_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "token" character varying NOT NULL, "expires" bigint NOT NULL, "userId" uuid, CONSTRAINT "PK_8fb1bc7333c3b9f249f9feaa55d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_f8ecddfc60e9d1c2719ab17fe6a" UNIQUE ("authId")`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blacklisted_tokens" ADD CONSTRAINT "FK_fc690bef555ae373813789f3c4b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f8ecddfc60e9d1c2719ab17fe6a" FOREIGN KEY ("authId") REFERENCES "authentication_information"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f8ecddfc60e9d1c2719ab17fe6a"`);
        await queryRunner.query(`ALTER TABLE "blacklisted_tokens" DROP CONSTRAINT "FK_fc690bef555ae373813789f3c4b"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_f8ecddfc60e9d1c2719ab17fe6a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authId"`);
        await queryRunner.query(`DROP TABLE "blacklisted_tokens"`);
        await queryRunner.query(`DROP TABLE "authentication_information"`);
    }

}
