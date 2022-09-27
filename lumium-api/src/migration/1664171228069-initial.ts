import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1664171228069 implements MigrationInterface {
    name = 'initial1664171228069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."address_kind_enum" AS ENUM('residential', 'billing')`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "kind" "public"."address_kind_enum" NOT NULL DEFAULT 'billing', "fullName" character varying NOT NULL, "lineOne" character varying NOT NULL, "lineTwo" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_98af914291cf7938b4affa8a619" UNIQUE ("userId", "kind"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "email" character varying NOT NULL, "primary" boolean, "verified" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "UQ_fee9013b697946e8129caba8983" UNIQUE ("email"), CONSTRAINT "UQ_ccffedc0aba599f3492882a93ee" UNIQUE ("userId", "primary"), CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."content_element_type_enum" AS ENUM('markdown')`);
        await queryRunner.query(`CREATE TABLE "content_element" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "content" character varying NOT NULL, "type" "public"."content_element_type_enum" NOT NULL DEFAULT 'markdown', CONSTRAINT "PK_3f2df194ca73a354abd12d36b2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page_content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "position" integer NOT NULL, "pageId" uuid, CONSTRAINT "PK_c2b7b56ba057b319ed037ed878b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."workspace_preference_option_enum" AS ENUM()`);
        await queryRunner.query(`CREATE TABLE "workspace_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "option" "public"."workspace_preference_option_enum" NOT NULL, "value" character varying NOT NULL, "workspaceId" uuid, CONSTRAINT "PK_35f7dc3786868684b519fe7ebe1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "ownerId" uuid, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "workspaceId" uuid, "ownerId" uuid, CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_preference_option_enum" AS ENUM('color_mode')`);
        await queryRunner.query(`CREATE TABLE "user_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "option" "public"."user_preference_option_enum" NOT NULL, "value" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "firstName" character varying, "lastName" character varying, "nickName" character varying, "birthday" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."audit_entry_type_enum" AS ENUM('user_signup_init', 'user_signup_complete', 'user_signup_failed', 'user_signin', 'user_inconsistent_signup', 'user_email_verified', 'user_email_verification_failed')`);
        await queryRunner.query(`CREATE TYPE "public"."audit_entry_level_enum" AS ENUM('verbose', 'debug', 'info', 'warning', 'error', 'fatal')`);
        await queryRunner.query(`CREATE TABLE "audit_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "type" "public"."audit_entry_type_enum" NOT NULL, "level" "public"."audit_entry_level_enum" NOT NULL DEFAULT 'info', "detail" character varying, "userId" uuid, CONSTRAINT "PK_58a130a4b9da189f46ba2a01801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page_content_content_elements_content_element" ("pageContentId" uuid NOT NULL, "contentElementId" uuid NOT NULL, CONSTRAINT "PK_1aa253fda2d61eb758c66390397" PRIMARY KEY ("pageContentId", "contentElementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8022f1e2cf8dac742ba82e712" ON "page_content_content_elements_content_element" ("pageContentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d240e6bb506a68cc03810af5bf" ON "page_content_content_elements_content_element" ("contentElementId") `);
        await queryRunner.query(`CREATE TABLE "workspace_admins_user" ("workspaceId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_ca02bf956e466e8a520f3a3d316" PRIMARY KEY ("workspaceId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c4a8a6f7cf32d285e2eda381f1" ON "workspace_admins_user" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08683b75195b15a04ac1875e2c" ON "workspace_admins_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "workspace_members_user" ("workspaceId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_78bf26db37b5409097c883e1985" PRIMARY KEY ("workspaceId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2f1c37290df3031f715f1e7b8" ON "workspace_members_user" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca7791a2d586bc444a938a24b0" ON "workspace_members_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "workspace_visitors_user" ("workspaceId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_d16926e1fa5dfa2fef0f07a0546" PRIMARY KEY ("workspaceId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0e0004e3b0281206c650f4f878" ON "workspace_visitors_user" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d22318be5a123cbf230b2d702" ON "workspace_visitors_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "page_admins_user" ("pageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_ddf8bdc8aea29963c1c745e42aa" PRIMARY KEY ("pageId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbc14dab249188eab9c888287d" ON "page_admins_user" ("pageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_64d36958fc16f5cbd03a92ed8d" ON "page_admins_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "page_members_user" ("pageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_097bee7201884b84973c1b05ce7" PRIMARY KEY ("pageId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06bba9cac8f07faf5a5944d5e9" ON "page_members_user" ("pageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_df56e47f62caed048219e3dc3b" ON "page_members_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "page_visitors_user" ("pageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_fabcaa4d4fe86408b79629718d9" PRIMARY KEY ("pageId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9995661530ac343a153d66db46" ON "page_visitors_user" ("pageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc7317f9dc59d8f79cc5a28d2d" ON "page_visitors_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email" ADD CONSTRAINT "FK_13e97b4a1d6074fd75ea1bb844e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_content" ADD CONSTRAINT "FK_4e28fda8b4d802c7e7a3e8c03e2" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" ADD CONSTRAINT "FK_87ea0bdd649b119d842f233ab37" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page" ADD CONSTRAINT "FK_3e419598ba888095f081633c512" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page" ADD CONSTRAINT "FK_181d08bb1a292753ad89ec74ea7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preference" ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_entry" ADD CONSTRAINT "FK_3a69a645488fcd51f01d6f85d80" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_content_content_elements_content_element" ADD CONSTRAINT "FK_d8022f1e2cf8dac742ba82e7124" FOREIGN KEY ("pageContentId") REFERENCES "page_content"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_content_content_elements_content_element" ADD CONSTRAINT "FK_d240e6bb506a68cc03810af5bf8" FOREIGN KEY ("contentElementId") REFERENCES "content_element"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_admins_user" ADD CONSTRAINT "FK_c4a8a6f7cf32d285e2eda381f18" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workspace_admins_user" ADD CONSTRAINT "FK_08683b75195b15a04ac1875e2ce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_members_user" ADD CONSTRAINT "FK_e2f1c37290df3031f715f1e7b8f" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workspace_members_user" ADD CONSTRAINT "FK_ca7791a2d586bc444a938a24b0b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace_visitors_user" ADD CONSTRAINT "FK_0e0004e3b0281206c650f4f878f" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workspace_visitors_user" ADD CONSTRAINT "FK_1d22318be5a123cbf230b2d7022" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_admins_user" ADD CONSTRAINT "FK_fbc14dab249188eab9c888287de" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_admins_user" ADD CONSTRAINT "FK_64d36958fc16f5cbd03a92ed8d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_members_user" ADD CONSTRAINT "FK_06bba9cac8f07faf5a5944d5e93" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_members_user" ADD CONSTRAINT "FK_df56e47f62caed048219e3dc3bc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_visitors_user" ADD CONSTRAINT "FK_9995661530ac343a153d66db46f" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_visitors_user" ADD CONSTRAINT "FK_bc7317f9dc59d8f79cc5a28d2da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_visitors_user" DROP CONSTRAINT "FK_bc7317f9dc59d8f79cc5a28d2da"`);
        await queryRunner.query(`ALTER TABLE "page_visitors_user" DROP CONSTRAINT "FK_9995661530ac343a153d66db46f"`);
        await queryRunner.query(`ALTER TABLE "page_members_user" DROP CONSTRAINT "FK_df56e47f62caed048219e3dc3bc"`);
        await queryRunner.query(`ALTER TABLE "page_members_user" DROP CONSTRAINT "FK_06bba9cac8f07faf5a5944d5e93"`);
        await queryRunner.query(`ALTER TABLE "page_admins_user" DROP CONSTRAINT "FK_64d36958fc16f5cbd03a92ed8d5"`);
        await queryRunner.query(`ALTER TABLE "page_admins_user" DROP CONSTRAINT "FK_fbc14dab249188eab9c888287de"`);
        await queryRunner.query(`ALTER TABLE "workspace_visitors_user" DROP CONSTRAINT "FK_1d22318be5a123cbf230b2d7022"`);
        await queryRunner.query(`ALTER TABLE "workspace_visitors_user" DROP CONSTRAINT "FK_0e0004e3b0281206c650f4f878f"`);
        await queryRunner.query(`ALTER TABLE "workspace_members_user" DROP CONSTRAINT "FK_ca7791a2d586bc444a938a24b0b"`);
        await queryRunner.query(`ALTER TABLE "workspace_members_user" DROP CONSTRAINT "FK_e2f1c37290df3031f715f1e7b8f"`);
        await queryRunner.query(`ALTER TABLE "workspace_admins_user" DROP CONSTRAINT "FK_08683b75195b15a04ac1875e2ce"`);
        await queryRunner.query(`ALTER TABLE "workspace_admins_user" DROP CONSTRAINT "FK_c4a8a6f7cf32d285e2eda381f18"`);
        await queryRunner.query(`ALTER TABLE "page_content_content_elements_content_element" DROP CONSTRAINT "FK_d240e6bb506a68cc03810af5bf8"`);
        await queryRunner.query(`ALTER TABLE "page_content_content_elements_content_element" DROP CONSTRAINT "FK_d8022f1e2cf8dac742ba82e7124"`);
        await queryRunner.query(`ALTER TABLE "audit_entry" DROP CONSTRAINT "FK_3a69a645488fcd51f01d6f85d80"`);
        await queryRunner.query(`ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"`);
        await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_181d08bb1a292753ad89ec74ea7"`);
        await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_3e419598ba888095f081633c512"`);
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`);
        await queryRunner.query(`ALTER TABLE "workspace_preference" DROP CONSTRAINT "FK_87ea0bdd649b119d842f233ab37"`);
        await queryRunner.query(`ALTER TABLE "page_content" DROP CONSTRAINT "FK_4e28fda8b4d802c7e7a3e8c03e2"`);
        await queryRunner.query(`ALTER TABLE "email" DROP CONSTRAINT "FK_13e97b4a1d6074fd75ea1bb844e"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc7317f9dc59d8f79cc5a28d2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9995661530ac343a153d66db46"`);
        await queryRunner.query(`DROP TABLE "page_visitors_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df56e47f62caed048219e3dc3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06bba9cac8f07faf5a5944d5e9"`);
        await queryRunner.query(`DROP TABLE "page_members_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64d36958fc16f5cbd03a92ed8d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbc14dab249188eab9c888287d"`);
        await queryRunner.query(`DROP TABLE "page_admins_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d22318be5a123cbf230b2d702"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e0004e3b0281206c650f4f878"`);
        await queryRunner.query(`DROP TABLE "workspace_visitors_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca7791a2d586bc444a938a24b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2f1c37290df3031f715f1e7b8"`);
        await queryRunner.query(`DROP TABLE "workspace_members_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08683b75195b15a04ac1875e2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4a8a6f7cf32d285e2eda381f1"`);
        await queryRunner.query(`DROP TABLE "workspace_admins_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d240e6bb506a68cc03810af5bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8022f1e2cf8dac742ba82e712"`);
        await queryRunner.query(`DROP TABLE "page_content_content_elements_content_element"`);
        await queryRunner.query(`DROP TABLE "audit_entry"`);
        await queryRunner.query(`DROP TYPE "public"."audit_entry_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."audit_entry_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_preference"`);
        await queryRunner.query(`DROP TYPE "public"."user_preference_option_enum"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`DROP TABLE "workspace_preference"`);
        await queryRunner.query(`DROP TYPE "public"."workspace_preference_option_enum"`);
        await queryRunner.query(`DROP TABLE "page_content"`);
        await queryRunner.query(`DROP TABLE "content_element"`);
        await queryRunner.query(`DROP TYPE "public"."content_element_type_enum"`);
        await queryRunner.query(`DROP TABLE "email"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TYPE "public"."address_kind_enum"`);
    }

}