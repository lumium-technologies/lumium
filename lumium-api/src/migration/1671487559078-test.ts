import { MigrationInterface, QueryRunner } from "typeorm";

export class test1671487559078 implements MigrationInterface {
    name = 'test1671487559078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_4c0073fedaf9eb9e91851fe4adc"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_4c0073fedaf9eb9e91851fe4adc" FOREIGN KEY ("keyId") REFERENCES "end_to_end_keys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_4c0073fedaf9eb9e91851fe4adc"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_4c0073fedaf9eb9e91851fe4adc" FOREIGN KEY ("keyId") REFERENCES "end_to_end_keys"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
