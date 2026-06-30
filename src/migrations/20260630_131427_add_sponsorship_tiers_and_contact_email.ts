import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `sponsorshipTiers` layout block (used on the Become a Sponsor page)
 * and an optional `contact_email` field on the `sponsorInquiryForm` block.
 *
 * The block introduces a `tiers` array, each tier holding a nested `features`
 * array, mirrored on the `_pages_v` versions tables.
 *
 * Every statement is guarded so the migration is idempotent: it is correct
 * whether or not `push: true` has already created the tables in development.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_sponsorship_tiers_background')
      THEN CREATE TYPE "public"."enum_pages_blocks_sponsorship_tiers_background" AS ENUM('primary', 'white', 'secondary', 'dark');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_blocks_sponsorship_tiers_background')
      THEN CREATE TYPE "public"."enum__pages_v_blocks_sponsorship_tiers_background" AS ENUM('primary', 'white', 'secondary', 'dark');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers_features" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "feature" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "amount" varchar,
      "highlighted" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_sponsorship_tiers" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "subheading" varchar,
      "background" "enum_pages_blocks_sponsorship_tiers_background" DEFAULT 'white',
      "footnote" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_features" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "feature" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "amount" varchar,
      "highlighted" boolean DEFAULT false,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "subheading" varchar,
      "background" "enum__pages_v_blocks_sponsorship_tiers_background" DEFAULT 'white',
      "footnote" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    ALTER TABLE "pages_blocks_sponsor_inquiry_form" ADD COLUMN IF NOT EXISTS "contact_email" varchar;
    ALTER TABLE "_pages_v_blocks_sponsor_inquiry_form" ADD COLUMN IF NOT EXISTS "contact_email" varchar;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_blocks_sponsorship_tiers_tiers_features_parent_id_fk')
      THEN ALTER TABLE "pages_blocks_sponsorship_tiers_tiers_features" ADD CONSTRAINT "pages_blocks_sponsorship_tiers_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sponsorship_tiers_tiers"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_blocks_sponsorship_tiers_tiers_parent_id_fk')
      THEN ALTER TABLE "pages_blocks_sponsorship_tiers_tiers" ADD CONSTRAINT "pages_blocks_sponsorship_tiers_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sponsorship_tiers"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='pages_blocks_sponsorship_tiers_parent_id_fk')
      THEN ALTER TABLE "pages_blocks_sponsorship_tiers" ADD CONSTRAINT "pages_blocks_sponsorship_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_blocks_sponsorship_tiers_tiers_features_parent_id_fk')
      THEN ALTER TABLE "_pages_v_blocks_sponsorship_tiers_tiers_features" ADD CONSTRAINT "_pages_v_blocks_sponsorship_tiers_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sponsorship_tiers_tiers"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_blocks_sponsorship_tiers_tiers_parent_id_fk')
      THEN ALTER TABLE "_pages_v_blocks_sponsorship_tiers_tiers" ADD CONSTRAINT "_pages_v_blocks_sponsorship_tiers_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sponsorship_tiers"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='_pages_v_blocks_sponsorship_tiers_parent_id_fk')
      THEN ALTER TABLE "_pages_v_blocks_sponsorship_tiers" ADD CONSTRAINT "_pages_v_blocks_sponsorship_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers_features_order_idx" ON "pages_blocks_sponsorship_tiers_tiers_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers_features_parent_id_idx" ON "pages_blocks_sponsorship_tiers_tiers_features" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers_order_idx" ON "pages_blocks_sponsorship_tiers_tiers" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_tiers_parent_id_idx" ON "pages_blocks_sponsorship_tiers_tiers" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_order_idx" ON "pages_blocks_sponsorship_tiers" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_parent_id_idx" ON "pages_blocks_sponsorship_tiers" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_sponsorship_tiers_path_idx" ON "pages_blocks_sponsorship_tiers" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_features_order_idx" ON "_pages_v_blocks_sponsorship_tiers_tiers_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_features_parent_id_idx" ON "_pages_v_blocks_sponsorship_tiers_tiers_features" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_order_idx" ON "_pages_v_blocks_sponsorship_tiers_tiers" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_parent_id_idx" ON "_pages_v_blocks_sponsorship_tiers_tiers" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_order_idx" ON "_pages_v_blocks_sponsorship_tiers" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_parent_id_idx" ON "_pages_v_blocks_sponsorship_tiers" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsorship_tiers_path_idx" ON "_pages_v_blocks_sponsorship_tiers" USING btree ("_path");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_sponsorship_tiers_tiers_features" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_sponsorship_tiers_tiers" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_sponsorship_tiers" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_sponsorship_tiers_tiers_features" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_sponsorship_tiers_tiers" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_sponsorship_tiers" CASCADE;
    ALTER TABLE "pages_blocks_sponsor_inquiry_form" DROP COLUMN IF EXISTS "contact_email";
    ALTER TABLE "_pages_v_blocks_sponsor_inquiry_form" DROP COLUMN IF EXISTS "contact_email";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_sponsorship_tiers_background";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_sponsorship_tiers_background";`)
}
