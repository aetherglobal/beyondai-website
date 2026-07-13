import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_programs_grid_layout" AS ENUM('grid', 'showcase');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_programs_grid_layout" AS ENUM('grid', 'showcase');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "pages_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "pages_blocks_programs_grid" ADD COLUMN IF NOT EXISTS "layout" "enum_pages_blocks_programs_grid_layout" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "_pages_v_blocks_programs_grid" ADD COLUMN IF NOT EXISTS "layout" "enum__pages_v_blocks_programs_grid_layout" DEFAULT 'grid';
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_programs_grid_items" ADD CONSTRAINT "pages_blocks_programs_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_programs_grid_items" ADD CONSTRAINT "_pages_v_blocks_programs_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_programs_grid_items_image_idx" ON "pages_blocks_programs_grid_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_programs_grid_items_image_idx" ON "_pages_v_blocks_programs_grid_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_programs_grid_items" DROP CONSTRAINT IF EXISTS "pages_blocks_programs_grid_items_image_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_programs_grid_items_image_id_media_id_fk";
  DROP INDEX IF EXISTS "pages_blocks_programs_grid_items_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_programs_grid_items_image_idx";
  ALTER TABLE "pages_blocks_programs_grid_items" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "pages_blocks_programs_grid" DROP COLUMN IF EXISTS "layout";
  ALTER TABLE "_pages_v_blocks_programs_grid_items" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "_pages_v_blocks_programs_grid" DROP COLUMN IF EXISTS "layout";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_programs_grid_layout";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_programs_grid_layout";`)
}
