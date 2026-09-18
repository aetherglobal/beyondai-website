import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_hero_slides" ADD COLUMN IF NOT EXISTS "heading_accent" varchar;
    ALTER TABLE "_pages_v_version_hero_slides" ADD COLUMN IF NOT EXISTS "heading_accent" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_hero_slides" DROP COLUMN IF EXISTS "heading_accent";
    ALTER TABLE "_pages_v_version_hero_slides" DROP COLUMN IF EXISTS "heading_accent";`)
}
