import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_statement_section_layout" AS ENUM('default', 'collage');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_statement_section_layout" AS ENUM('default', 'collage');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "pages_blocks_statement_section" ADD COLUMN IF NOT EXISTS "layout" "enum_pages_blocks_statement_section_layout" DEFAULT 'default';
  ALTER TABLE "pages_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_main_id" integer;
  ALTER TABLE "pages_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_top_right_id" integer;
  ALTER TABLE "pages_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_bottom_right_id" integer;
  ALTER TABLE "_pages_v_blocks_statement_section" ADD COLUMN IF NOT EXISTS "layout" "enum__pages_v_blocks_statement_section_layout" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_main_id" integer;
  ALTER TABLE "_pages_v_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_top_right_id" integer;
  ALTER TABLE "_pages_v_blocks_statement_section" ADD COLUMN IF NOT EXISTS "collage_images_bottom_right_id" integer;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_statement_section" ADD CONSTRAINT "pages_blocks_statement_section_collage_images_main_id_media_id_fk" FOREIGN KEY ("collage_images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_statement_section" ADD CONSTRAINT "pages_blocks_statement_section_collage_images_top_right_id_media_id_fk" FOREIGN KEY ("collage_images_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_statement_section" ADD CONSTRAINT "pages_blocks_statement_section_collage_images_bottom_right_id_media_id_fk" FOREIGN KEY ("collage_images_bottom_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_statement_section" ADD CONSTRAINT "_pages_v_blocks_statement_section_collage_images_main_id_media_id_fk" FOREIGN KEY ("collage_images_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_statement_section" ADD CONSTRAINT "_pages_v_blocks_statement_section_collage_images_top_right_id_media_id_fk" FOREIGN KEY ("collage_images_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_statement_section" ADD CONSTRAINT "_pages_v_blocks_statement_section_collage_images_bottom_right_id_media_id_fk" FOREIGN KEY ("collage_images_bottom_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_statement_section_collage_images_collage_im_idx" ON "pages_blocks_statement_section" USING btree ("collage_images_main_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_statement_section_collage_images_collage__1_idx" ON "pages_blocks_statement_section" USING btree ("collage_images_top_right_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_statement_section_collage_images_collage__2_idx" ON "pages_blocks_statement_section" USING btree ("collage_images_bottom_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_statement_section_collage_images_collage_idx" ON "_pages_v_blocks_statement_section" USING btree ("collage_images_main_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_statement_section_collage_images_colla_1_idx" ON "_pages_v_blocks_statement_section" USING btree ("collage_images_top_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_statement_section_collage_images_colla_2_idx" ON "_pages_v_blocks_statement_section" USING btree ("collage_images_bottom_right_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_statement_section" DROP CONSTRAINT IF EXISTS "pages_blocks_statement_section_collage_images_main_id_media_id_fk";
  ALTER TABLE "pages_blocks_statement_section" DROP CONSTRAINT IF EXISTS "pages_blocks_statement_section_collage_images_top_right_id_media_id_fk";
  ALTER TABLE "pages_blocks_statement_section" DROP CONSTRAINT IF EXISTS "pages_blocks_statement_section_collage_images_bottom_right_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_statement_section_collage_images_main_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_statement_section_collage_images_top_right_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_statement_section_collage_images_bottom_right_id_media_id_fk";
  DROP INDEX IF EXISTS "pages_blocks_statement_section_collage_images_collage_im_idx";
  DROP INDEX IF EXISTS "pages_blocks_statement_section_collage_images_collage__1_idx";
  DROP INDEX IF EXISTS "pages_blocks_statement_section_collage_images_collage__2_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_statement_section_collage_images_collage_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_statement_section_collage_images_colla_1_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_statement_section_collage_images_colla_2_idx";
  ALTER TABLE "pages_blocks_statement_section" DROP COLUMN IF EXISTS "layout";
  ALTER TABLE "pages_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_main_id";
  ALTER TABLE "pages_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_top_right_id";
  ALTER TABLE "pages_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_bottom_right_id";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP COLUMN IF EXISTS "layout";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_main_id";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_top_right_id";
  ALTER TABLE "_pages_v_blocks_statement_section" DROP COLUMN IF EXISTS "collage_images_bottom_right_id";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_statement_section_layout";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_statement_section_layout";`)
}
