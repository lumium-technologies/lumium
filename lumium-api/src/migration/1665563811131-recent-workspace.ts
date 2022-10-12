import { MigrationInterface, QueryRunner } from "typeorm";

export class recentWorkspace1665563811131 implements MigrationInterface {
    name = 'recentWorkspace1665563811131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "recentWorkspaceId" uuid`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7c0e92a8b4eb0a82f80299cf926" FOREIGN KEY ("recentWorkspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7c0e92a8b4eb0a82f80299cf926"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "recentWorkspaceId"`);
    }

}
