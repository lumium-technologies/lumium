import { MigrationInterface, QueryRunner } from "typeorm";

export class e2eTables1664542491062 implements MigrationInterface {
    name = 'e2eTables1664542491062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "e2_e_key_variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "activator" character varying NOT NULL, "value" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "keyId" uuid, CONSTRAINT "PK_197edd980f02702897d9aebf78d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "e2_e_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_1f18f674ea742329d798808aeaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" ADD "option" "public"."workspace_preference_option_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e2_e_key_variant" ADD CONSTRAINT "FK_2c01965ae18911625e806f4371f" FOREIGN KEY ("keyId") REFERENCES "e2_e_key"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e2_e_key_variant" DROP CONSTRAINT "FK_2c01965ae18911625e806f4371f"`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" ADD "option" workspace_preference_option_enum NOT NULL`);
        await queryRunner.query(`DROP TABLE "e2_e_key"`);
        await queryRunner.query(`DROP TABLE "e2_e_key_variant"`);
    }

}
