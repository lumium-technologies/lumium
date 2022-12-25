import { MigrationInterface, QueryRunner } from "typeorm";

export class page1671981988404 implements MigrationInterface {
    name = 'page1671981988404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "content"`);
    }

}
