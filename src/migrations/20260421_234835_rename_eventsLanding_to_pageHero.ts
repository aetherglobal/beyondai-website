import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Dev push already created the new enum with 'pageHero'.
  // Update any rows still holding the old text value.
  await db.execute(sql`
    UPDATE "pages"
      SET "hero_type" = 'pageHero'
      WHERE "hero_type"::text = 'eventsLanding';

    UPDATE "_pages_v"
      SET "version_hero_type" = 'pageHero'
      WHERE "version_hero_type"::text = 'eventsLanding';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "pages"
      SET "hero_type" = 'eventsLanding'
      WHERE "hero_type"::text = 'pageHero';

    UPDATE "_pages_v"
      SET "version_hero_type" = 'eventsLanding'
      WHERE "version_hero_type"::text = 'pageHero';
  `)
}
