import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "people" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "title" varchar,
      "bio" varchar,
      "photo_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='people_photo_id_media_id_fk')
      THEN ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "people_photo_idx" ON "people" USING btree ("photo_id");
    CREATE INDEX IF NOT EXISTS "people_updated_at_idx" ON "people" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "people_created_at_idx" ON "people" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "people_id" integer;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='payload_locked_documents_rels_people_fk')
      THEN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");

    ALTER TABLE "events_hosts" ADD COLUMN IF NOT EXISTS "person_id" integer, ADD COLUMN IF NOT EXISTS "role" varchar;
    ALTER TABLE "events_speakers" ADD COLUMN IF NOT EXISTS "person_id" integer, ADD COLUMN IF NOT EXISTS "role" varchar;
    ALTER TABLE "_events_v_version_hosts" ADD COLUMN IF NOT EXISTS "person_id" integer, ADD COLUMN IF NOT EXISTS "role" varchar;
    ALTER TABLE "_events_v_version_speakers" ADD COLUMN IF NOT EXISTS "person_id" integer, ADD COLUMN IF NOT EXISTS "role" varchar;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hosts_person_id_people_id_fk')
      THEN ALTER TABLE "events_hosts" ADD CONSTRAINT "events_hosts_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_speakers_person_id_people_id_fk')
      THEN ALTER TABLE "events_speakers" ADD CONSTRAINT "events_speakers_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hosts_person_id_people_id_fk')
      THEN ALTER TABLE "_events_v_version_hosts" ADD CONSTRAINT "_events_v_version_hosts_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_speakers_person_id_people_id_fk')
      THEN ALTER TABLE "_events_v_version_speakers" ADD CONSTRAINT "_events_v_version_speakers_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "events_hosts_person_idx" ON "events_hosts" USING btree ("person_id");
    CREATE INDEX IF NOT EXISTS "events_speakers_person_idx" ON "events_speakers" USING btree ("person_id");
    CREATE INDEX IF NOT EXISTS "_events_v_version_hosts_person_idx" ON "_events_v_version_hosts" USING btree ("person_id");
    CREATE INDEX IF NOT EXISTS "_events_v_version_speakers_person_idx" ON "_events_v_version_speakers" USING btree ("person_id");`)

  await db.execute(sql`
    WITH src AS (
      SELECT regexp_replace(btrim(name), '[[:space:]]+', ' ', 'g') AS name, title, bio, photo_id, 1 AS pref
        FROM events_hosts    WHERE nullif(btrim(name), '') IS NOT NULL
      UNION ALL
      SELECT regexp_replace(btrim(name), '[[:space:]]+', ' ', 'g'), title, bio, photo_id, 1
        FROM events_speakers WHERE nullif(btrim(name), '') IS NOT NULL
      UNION ALL
      SELECT regexp_replace(btrim(v.name), '[[:space:]]+', ' ', 'g'), v.title, v.bio, v.photo_id, 2
        FROM _events_v_version_hosts v JOIN _events_v p ON p.id = v._parent_id
       WHERE p.latest IS TRUE AND nullif(btrim(v.name), '') IS NOT NULL
      UNION ALL
      SELECT regexp_replace(btrim(v.name), '[[:space:]]+', ' ', 'g'), v.title, v.bio, v.photo_id, 2
        FROM _events_v_version_speakers v JOIN _events_v p ON p.id = v._parent_id
       WHERE p.latest IS TRUE AND nullif(btrim(v.name), '') IS NOT NULL
    ),
    merged AS (
      SELECT lower(name) AS key,
        (array_agg(name ORDER BY (name = upper(name) AND name <> lower(name)), pref, length(name) DESC, name))[1] AS name,
        (array_agg(title ORDER BY (nullif(btrim(coalesce(title, '')), '') IS NULL), pref, length(coalesce(title, '')) DESC, title))[1] AS title,
        (array_agg(bio ORDER BY (nullif(btrim(coalesce(bio, '')), '') IS NULL), pref, length(coalesce(bio, '')) DESC, bio))[1] AS bio,
        (array_agg(photo_id ORDER BY (photo_id IS NULL), pref, photo_id))[1] AS photo_id
      FROM src GROUP BY lower(name)
    )
    INSERT INTO people (name, title, bio, photo_id, updated_at, created_at)
    SELECT m.name,
           nullif(btrim(coalesce(m.title, '')), ''),
           nullif(btrim(coalesce(m.bio, '')), ''),
           m.photo_id,
           now(), now()
      FROM merged m
     WHERE NOT EXISTS (
       SELECT 1 FROM people p
        WHERE lower(regexp_replace(btrim(p.name), '[[:space:]]+', ' ', 'g')) = m.key
     );`)

  for (const table of [
    'events_hosts',
    'events_speakers',
    '_events_v_version_hosts',
    '_events_v_version_speakers',
  ]) {
    await db.execute(sql`
      UPDATE ${sql.raw(`"${table}"`)} r
         SET person_id = p.id,
             role = CASE
               WHEN nullif(btrim(coalesce(r.title, '')), '') IS NULL THEN NULL
               WHEN lower(btrim(r.title)) = lower(btrim(coalesce(p.title, ''))) THEN NULL
               ELSE btrim(r.title)
             END
        FROM people p
       WHERE r.person_id IS NULL
         AND lower(regexp_replace(btrim(r.name), '[[:space:]]+', ' ', 'g'))
           = lower(regexp_replace(btrim(p.name), '[[:space:]]+', ' ', 'g'));`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events_hosts" DROP COLUMN IF EXISTS "person_id", DROP COLUMN IF EXISTS "role";
    ALTER TABLE "events_speakers" DROP COLUMN IF EXISTS "person_id", DROP COLUMN IF EXISTS "role";
    ALTER TABLE "_events_v_version_hosts" DROP COLUMN IF EXISTS "person_id", DROP COLUMN IF EXISTS "role";
    ALTER TABLE "_events_v_version_speakers" DROP COLUMN IF EXISTS "person_id", DROP COLUMN IF EXISTS "role";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "people_id";
    DROP TABLE IF EXISTS "people" CASCADE;`)
}
