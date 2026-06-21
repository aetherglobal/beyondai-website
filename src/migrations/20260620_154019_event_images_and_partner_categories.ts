import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Consolidated migration (supersedes the earlier split pair: the hand-written
 * event-image rename and the auto-generated partner-category restructure).
 *
 * It performs, in one coherent step, the transform from the baseline schema
 * (snapshot 20260421) to the current config:
 *
 *   1. Events image split — rename `hero_image_id` -> `flyer_image_id` (so the
 *      original single image becomes the Flyer and existing data is preserved),
 *      then add a new, empty `hero_image_id` for the Hero/background image.
 *      Mirrored on the `_events_v` versions table.
 *   2. Sponsors taxonomy — remap `knowledge-partner` -> `collaborator`,
 *      `community-partner` -> `media-partner`, and rebuild `enum_sponsors_type`.
 *   3. Contact submissions — same remap for `partnership_interest`.
 *   4. Gallery — create the `gallery_images` table and its
 *      `payload_locked_documents_rels` relationship.
 *
 * Every statement is guarded so the migration is idempotent: correct when run
 * linearly on a fresh/production DB, and a safe no-op on a DB that `push` has
 * already reconciled (e.g. the dev database).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Events image split: rename hero_image_id -> flyer_image_id (preserves data) ----------
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='hero_image_id')
        AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='flyer_image_id')
      THEN ALTER TABLE "events" RENAME COLUMN "hero_image_id" TO "flyer_image_id"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hero_image_id_media_id_fk')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_flyer_image_id_media_id_fk')
      THEN ALTER TABLE "events" RENAME CONSTRAINT "events_hero_image_id_media_id_fk" TO "events_flyer_image_id_media_id_fk"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_class WHERE relname='events_hero_image_idx' AND relkind='i')
        AND NOT EXISTS (SELECT 1 FROM pg_class WHERE relname='events_flyer_image_idx' AND relkind='i')
      THEN ALTER INDEX "events_hero_image_idx" RENAME TO "events_flyer_image_idx"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_hero_image_id')
        AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_flyer_image_id')
      THEN ALTER TABLE "_events_v" RENAME COLUMN "version_hero_image_id" TO "version_flyer_image_id"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hero_image_id_media_id_fk')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_flyer_image_id_media_id_fk')
      THEN ALTER TABLE "_events_v" RENAME CONSTRAINT "_events_v_version_hero_image_id_media_id_fk" TO "_events_v_version_flyer_image_id_media_id_fk"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_class WHERE relname='_events_v_version_version_hero_image_idx' AND relkind='i')
        AND NOT EXISTS (SELECT 1 FROM pg_class WHERE relname='_events_v_version_version_flyer_image_idx' AND relkind='i')
      THEN ALTER INDEX "_events_v_version_version_hero_image_idx" RENAME TO "_events_v_version_version_flyer_image_idx"; END IF;
    END $$;

    -- add the new (empty) hero_image_id for the Hero/background image
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hero_image_id_media_id_fk')
      THEN ALTER TABLE "events" ADD CONSTRAINT "events_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "events_hero_image_idx" ON "events" USING btree ("hero_image_id");
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_hero_image_id" integer;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hero_image_id_media_id_fk')
      THEN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_hero_image_id_media_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "_events_v_version_version_hero_image_idx" ON "_events_v" USING btree ("version_hero_image_id");

    -- 2. Sponsors taxonomy -------------------------------------------------------------------
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
                 WHERE t.typname = 'enum_sponsors_type' AND e.enumlabel IN ('knowledge-partner','community-partner'))
      THEN
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DATA TYPE text;
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DEFAULT 'sponsor'::text;
        UPDATE "sponsors" SET "type" = 'collaborator'  WHERE "type" = 'knowledge-partner';
        UPDATE "sponsors" SET "type" = 'media-partner' WHERE "type" = 'community-partner';
        DROP TYPE "public"."enum_sponsors_type";
        CREATE TYPE "public"."enum_sponsors_type" AS ENUM('sponsor', 'collaborator', 'media-partner');
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DEFAULT 'sponsor'::"public"."enum_sponsors_type";
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DATA TYPE "public"."enum_sponsors_type" USING "type"::"public"."enum_sponsors_type";
      END IF;
    END $$;

    -- 3. Contact submissions partnership interest --------------------------------------------
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
                 WHERE t.typname = 'enum_contact_submissions_partnership_interest' AND e.enumlabel IN ('knowledge-partnership','community-partnership'))
      THEN
        ALTER TABLE "contact_submissions" ALTER COLUMN "partnership_interest" SET DATA TYPE text;
        UPDATE "contact_submissions" SET "partnership_interest" = 'collaboration'    WHERE "partnership_interest" = 'knowledge-partnership';
        UPDATE "contact_submissions" SET "partnership_interest" = 'media-partnership' WHERE "partnership_interest" = 'community-partnership';
        DROP TYPE "public"."enum_contact_submissions_partnership_interest";
        CREATE TYPE "public"."enum_contact_submissions_partnership_interest" AS ENUM('sponsorship', 'collaboration', 'media-partnership', 'in-kind-support', 'other');
        ALTER TABLE "contact_submissions" ALTER COLUMN "partnership_interest" SET DATA TYPE "public"."enum_contact_submissions_partnership_interest" USING "partnership_interest"::"public"."enum_contact_submissions_partnership_interest";
      END IF;
    END $$;

    -- 4. Gallery images ----------------------------------------------------------------------
    CREATE TABLE IF NOT EXISTS "gallery_images" (
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL,
      "caption" varchar,
      "event_id" integer,
      "featured" boolean DEFAULT false,
      "sort_order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "gallery_images_id" integer;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='gallery_images_image_id_media_id_fk')
      THEN ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='gallery_images_event_id_events_id_fk')
      THEN ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_event_id_events_id_fk"
        FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "gallery_images_event_idx" ON "gallery_images" USING btree ("event_id");
    CREATE INDEX IF NOT EXISTS "gallery_images_updated_at_idx" ON "gallery_images" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "gallery_images_created_at_idx" ON "gallery_images" USING btree ("created_at");
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='payload_locked_documents_rels_gallery_images_fk')
      THEN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_images_fk"
        FOREIGN KEY ("gallery_images_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action; END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_gallery_images_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_images_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- 4. Gallery images (reverse) ------------------------------------------------------------
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_gallery_images_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_gallery_images_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "gallery_images_id";
    DROP TABLE IF EXISTS "gallery_images" CASCADE;

    -- 3. Contact submissions (reverse) -------------------------------------------------------
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
                 WHERE t.typname = 'enum_contact_submissions_partnership_interest' AND e.enumlabel IN ('collaboration','media-partnership'))
      THEN
        ALTER TABLE "contact_submissions" ALTER COLUMN "partnership_interest" SET DATA TYPE text;
        UPDATE "contact_submissions" SET "partnership_interest" = 'knowledge-partnership' WHERE "partnership_interest" = 'collaboration';
        UPDATE "contact_submissions" SET "partnership_interest" = 'community-partnership' WHERE "partnership_interest" = 'media-partnership';
        DROP TYPE "public"."enum_contact_submissions_partnership_interest";
        CREATE TYPE "public"."enum_contact_submissions_partnership_interest" AS ENUM('sponsorship', 'knowledge-partnership', 'community-partnership', 'in-kind-support', 'other');
        ALTER TABLE "contact_submissions" ALTER COLUMN "partnership_interest" SET DATA TYPE "public"."enum_contact_submissions_partnership_interest" USING "partnership_interest"::"public"."enum_contact_submissions_partnership_interest";
      END IF;
    END $$;

    -- 2. Sponsors taxonomy (reverse) ---------------------------------------------------------
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
                 WHERE t.typname = 'enum_sponsors_type' AND e.enumlabel IN ('collaborator','media-partner'))
      THEN
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DATA TYPE text;
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DEFAULT 'sponsor'::text;
        UPDATE "sponsors" SET "type" = 'knowledge-partner' WHERE "type" = 'collaborator';
        UPDATE "sponsors" SET "type" = 'community-partner' WHERE "type" = 'media-partner';
        DROP TYPE "public"."enum_sponsors_type";
        CREATE TYPE "public"."enum_sponsors_type" AS ENUM('sponsor', 'knowledge-partner', 'community-partner');
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DEFAULT 'sponsor'::"public"."enum_sponsors_type";
        ALTER TABLE "sponsors" ALTER COLUMN "type" SET DATA TYPE "public"."enum_sponsors_type" USING "type"::"public"."enum_sponsors_type";
      END IF;
    END $$;

    -- 1. Events image split (reverse): drop new hero_image_id, rename flyer_image_id back -----
    DROP INDEX IF EXISTS "events_hero_image_idx";
    DROP INDEX IF EXISTS "_events_v_version_version_hero_image_idx";
    ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_hero_image_id_media_id_fk";
    ALTER TABLE "_events_v" DROP CONSTRAINT IF EXISTS "_events_v_version_hero_image_id_media_id_fk";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "hero_image_id";
    ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_hero_image_id";

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='flyer_image_id')
        AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='hero_image_id')
      THEN ALTER TABLE "events" RENAME COLUMN "flyer_image_id" TO "hero_image_id"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_flyer_image_id_media_id_fk')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='events_hero_image_id_media_id_fk')
      THEN ALTER TABLE "events" RENAME CONSTRAINT "events_flyer_image_id_media_id_fk" TO "events_hero_image_id_media_id_fk"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_class WHERE relname='events_flyer_image_idx' AND relkind='i')
        AND NOT EXISTS (SELECT 1 FROM pg_class WHERE relname='events_hero_image_idx' AND relkind='i')
      THEN ALTER INDEX "events_flyer_image_idx" RENAME TO "events_hero_image_idx"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_flyer_image_id')
        AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_hero_image_id')
      THEN ALTER TABLE "_events_v" RENAME COLUMN "version_flyer_image_id" TO "version_hero_image_id"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_flyer_image_id_media_id_fk')
        AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_events_v_version_hero_image_id_media_id_fk')
      THEN ALTER TABLE "_events_v" RENAME CONSTRAINT "_events_v_version_flyer_image_id_media_id_fk" TO "_events_v_version_hero_image_id_media_id_fk"; END IF;
    END $$;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_class WHERE relname='_events_v_version_version_flyer_image_idx' AND relkind='i')
        AND NOT EXISTS (SELECT 1 FROM pg_class WHERE relname='_events_v_version_version_hero_image_idx' AND relkind='i')
      THEN ALTER INDEX "_events_v_version_version_flyer_image_idx" RENAME TO "_events_v_version_version_hero_image_idx"; END IF;
    END $$;
  `)
}
