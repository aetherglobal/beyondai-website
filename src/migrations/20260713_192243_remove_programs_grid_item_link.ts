import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "pages_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_new_tab";
  ALTER TABLE "pages_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_url";
  ALTER TABLE "pages_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_label";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_new_tab";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_url";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP COLUMN IF EXISTS "link_label";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_programs_grid_items_link_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_programs_grid_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_programs_grid_items_link_type" AS ENUM('reference', 'custom');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_programs_grid_items_link_type" AS ENUM('reference', 'custom');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "pages_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_type" "enum_pages_blocks_programs_grid_items_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_url" varchar;
  ALTER TABLE "pages_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_type" "enum__pages_v_blocks_programs_grid_items_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "link_label" varchar;`)
}
