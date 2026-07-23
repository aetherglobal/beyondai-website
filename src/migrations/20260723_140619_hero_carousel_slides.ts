import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `heroCarousel` hero type and its `slides` array (each slide holds a
 * nested `ctas` array), mirrored on the `_pages_v` versions tables.
 *
 * Every statement is guarded so the migration is idempotent: it is correct
 * whether or not `push: true` has already created the tables/enum values in
 * development.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_hero_slides_ctas_variant')
      THEN CREATE TYPE "public"."enum_pages_hero_slides_ctas_variant" AS ENUM('primary', 'outline');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_version_hero_slides_ctas_variant')
      THEN CREATE TYPE "public"."enum__pages_v_version_hero_slides_ctas_variant" AS ENUM('primary', 'outline');
      END IF;
    END $$;

    ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'heroCarousel' BEFORE 'pageHero';
    ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'heroCarousel' BEFORE 'pageHero';

    CREATE TABLE IF NOT EXISTS "pages_hero_slides_ctas" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "variant" "enum_pages_hero_slides_ctas_variant" DEFAULT 'primary',
      "use_event_luma_url" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "pages_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "media_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_hero_slides_ctas" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "variant" "enum__pages_v_version_hero_slides_ctas_variant" DEFAULT 'primary',
      "use_event_luma_url" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "media_id" integer,
      "_uuid" varchar
    );

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_hero_slides_ctas_parent_id_fk')
      THEN ALTER TABLE "pages_hero_slides_ctas" ADD CONSTRAINT "pages_hero_slides_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_hero_slides_media_id_media_id_fk')
      THEN ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_hero_slides_parent_id_fk')
      THEN ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_version_hero_slides_ctas_parent_id_fk')
      THEN ALTER TABLE "_pages_v_version_hero_slides_ctas" ADD CONSTRAINT "_pages_v_version_hero_slides_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_version_hero_slides_media_id_media_id_fk')
      THEN ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_version_hero_slides_parent_id_fk')
      THEN ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_hero_slides_ctas_order_idx" ON "pages_hero_slides_ctas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_hero_slides_ctas_parent_id_idx" ON "pages_hero_slides_ctas" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_hero_slides_order_idx" ON "pages_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_hero_slides_parent_id_idx" ON "pages_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_hero_slides_media_idx" ON "pages_hero_slides" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_slides_ctas_order_idx" ON "_pages_v_version_hero_slides_ctas" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_slides_ctas_parent_id_idx" ON "_pages_v_version_hero_slides_ctas" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_slides_order_idx" ON "_pages_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_slides_parent_id_idx" ON "_pages_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_slides_media_idx" ON "_pages_v_version_hero_slides" USING btree ("media_id");`)
}

/**
 * Reverting removes the slides tables and the `heroCarousel` enum value.
 * Any page still set to `heroCarousel` must be switched to another hero type
 * before running this down migration, or the enum recreation will fail.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_hero_slides_ctas" CASCADE;
    DROP TABLE IF EXISTS "pages_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_hero_slides_ctas" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_hero_slides" CASCADE;

    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
    DROP TYPE IF EXISTS "public"."enum_pages_hero_type";
    CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'featuredEvent', 'pageHero');
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";

    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_type";
    CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'featuredEvent', 'pageHero');
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";

    DROP TYPE IF EXISTS "public"."enum_pages_hero_slides_ctas_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_slides_ctas_variant";`)
}
