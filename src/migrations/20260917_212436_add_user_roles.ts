import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'editor' NOT NULL;`)

  const result = await db.execute(
    sql`UPDATE "users" SET "role" = 'admin' WHERE "created_at" < now() RETURNING "email"`,
  )

  const rows = (result as unknown as { rows?: { email: string }[] })?.rows ?? []

  payload.logger.info(
    `Promoted ${rows.length} existing user(s) to admin: ${rows.map((r) => r.email).join(', ') || '(none)'}. ` +
      `Review roles in /admin and downgrade anyone who should be an editor.`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
    DROP TYPE IF EXISTS "public"."enum_users_role";`)
}
