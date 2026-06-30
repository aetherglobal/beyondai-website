import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `hosts` array field on the Events collection, mirroring the existing
 * `speakers` field. Each host holds name/title/bio and an optional `photo`
 * upload, with a parallel table on the `_events_v` versions/drafts side.
 *
 * Every statement is guarded so the migration is idempotent: it is correct
 * whether or not `push: true` has already created the tables in development.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "events_hosts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "title" varchar,
      "bio" varchar,
      "photo_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_events_v_version_hosts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "title" varchar,
      "bio" varchar,
      "photo_id" integer,
      "_uuid" varchar
    );

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hosts_photo_id_media_id_fk')
      THEN ALTER TABLE "events_hosts" ADD CONSTRAINT "events_hosts_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hosts_parent_id_fk')
      THEN ALTER TABLE "events_hosts" ADD CONSTRAINT "events_hosts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hosts_photo_id_media_id_fk')
      THEN ALTER TABLE "_events_v_version_hosts" ADD CONSTRAINT "_events_v_version_hosts_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hosts_parent_id_fk')
      THEN ALTER TABLE "_events_v_version_hosts" ADD CONSTRAINT "_events_v_version_hosts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "events_hosts_order_idx" ON "events_hosts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "events_hosts_parent_id_idx" ON "events_hosts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "events_hosts_photo_idx" ON "events_hosts" USING btree ("photo_id");
    CREATE INDEX IF NOT EXISTS "_events_v_version_hosts_order_idx" ON "_events_v_version_hosts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_events_v_version_hosts_parent_id_idx" ON "_events_v_version_hosts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_events_v_version_hosts_photo_idx" ON "_events_v_version_hosts" USING btree ("photo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "events_hosts" CASCADE;
    DROP TABLE IF EXISTS "_events_v_version_hosts" CASCADE;`)
}
