import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the optional `authorName` text field to the Posts collection — a manual
 * byline that overrides the linked account author(s) for display. Adds the
 * column to `posts` and the parallel `version_author_name` column on the
 * `_posts_v` versions/drafts table.
 *
 * Every statement is guarded with IF [NOT] EXISTS so the migration is
 * idempotent: it is correct whether or not `push: true` has already created
 * the columns in development.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_name" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_author_name" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "author_name";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_author_name";`)
}
