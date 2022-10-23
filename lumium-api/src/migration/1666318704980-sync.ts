import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1666318704980 implements MigrationInterface {
    name = 'sync1666318704980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" "public"."workspace_preferences_option_enum" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."audit_log_type_enum" RENAME TO "audit_log_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."audit_log_type_enum" AS ENUM('user_signup_init_development_patch', 'user_signup_init', 'user_signup_complete', 'user_signup_failed', 'user_signin', 'user_inconsistent_signup', 'user_email_verified', 'user_email_verification_failed', 'user_deleted', 'unauthorized_workspace_delete_attempt', 'unauthorized_workspace_patch_attempt')`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "type" TYPE "public"."audit_log_type_enum" USING "type"::"text"::"public"."audit_log_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."audit_log_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."audit_log_type_enum_old" AS ENUM('user_signup_init_development_patch', 'user_signup_init', 'user_signup_complete', 'user_signup_failed', 'user_signin', 'user_inconsistent_signup', 'user_email_verified', 'user_email_verification_failed', 'user_deleted', 'unauthorized_workspace_delete_attempt')`);
        await queryRunner.query(`ALTER TABLE "audit_log" ALTER COLUMN "type" TYPE "public"."audit_log_type_enum_old" USING "type"::"text"::"public"."audit_log_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."audit_log_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."audit_log_type_enum_old" RENAME TO "audit_log_type_enum"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" DROP COLUMN "option"`);
        await queryRunner.query(`ALTER TABLE "workspace_preferences" ADD "option" workspace_preferences_option_enum NOT NULL`);
    }

}