import { MigrationInterface, QueryRunner } from "typeorm";

export class workspacePageName1671052377954 implements MigrationInterface {
    name = 'workspacePageName1671052377954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspaces" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "UQ_de659ece27e93d8fe29339d0a42" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "UQ_fd04e631bf857b757e33711e5be" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "UQ_fd04e631bf857b757e33711e5be"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "UQ_de659ece27e93d8fe29339d0a42"`);
        await queryRunner.query(`ALTER TABLE "workspaces" DROP COLUMN "name"`);
    }

}
