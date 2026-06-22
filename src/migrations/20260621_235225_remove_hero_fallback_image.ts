import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Remove the `hero.fallbackImage` upload field from Pages.
 *
 * The Featured Event hero no longer borrows the upcoming event's image (or a
 * fallback) — it now renders its own dedicated `hero.media` image, which
 * already exists in the schema. This drops the obsolete `fallbackImage`
 * relationship on both the `pages` table and the `_pages_v` versions table.
 *
 * Every statement is guarded so the migration is idempotent: correct when run
 * linearly on a fresh/production DB, and a safe no-op on a DB that `push` has
 * already reconciled (e.g. the dev database).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "pages_hero_hero_fallback_image_idx";
    DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_fallback_image_idx";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_fallback_image_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_fallback_image_id_media_id_fk";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_fallback_image_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_fallback_image_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_fallback_image_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_fallback_image_id" integer;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_hero_fallback_image_id_media_id_fk')
      THEN ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_fallback_image_id_media_id_fk"
        FOREIGN KEY ("hero_fallback_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_version_hero_fallback_image_id_media_id_fk')
      THEN ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_fallback_image_id_media_id_fk"
        FOREIGN KEY ("version_hero_fallback_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_hero_hero_fallback_image_idx" ON "pages" USING btree ("hero_fallback_image_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_fallback_image_idx" ON "_pages_v" USING btree ("version_hero_fallback_image_id");
  `)
}
