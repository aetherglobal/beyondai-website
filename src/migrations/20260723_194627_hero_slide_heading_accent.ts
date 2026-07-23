import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds an optional `heading_accent` column to hero carousel slides (and its
 * `_pages_v` versions table), rendered as the accent-coloured final line of a
 * slide title.
 *
 * Guarded so it is idempotent whether or not `push: true` already added the
 * column in development.
 */
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
