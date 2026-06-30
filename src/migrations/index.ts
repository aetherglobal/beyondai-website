import * as migration_20260421_234835_rename_eventsLanding_to_pageHero from './20260421_234835_rename_eventsLanding_to_pageHero';
import * as migration_20260620_154019_event_images_and_partner_categories from './20260620_154019_event_images_and_partner_categories';
import * as migration_20260621_235225_remove_hero_fallback_image from './20260621_235225_remove_hero_fallback_image';
import * as migration_20260630_131427_add_sponsorship_tiers_and_contact_email from './20260630_131427_add_sponsorship_tiers_and_contact_email';

export const migrations = [
  {
    up: migration_20260421_234835_rename_eventsLanding_to_pageHero.up,
    down: migration_20260421_234835_rename_eventsLanding_to_pageHero.down,
    name: '20260421_234835_rename_eventsLanding_to_pageHero',
  },
  {
    up: migration_20260620_154019_event_images_and_partner_categories.up,
    down: migration_20260620_154019_event_images_and_partner_categories.down,
    name: '20260620_154019_event_images_and_partner_categories',
  },
  {
    up: migration_20260621_235225_remove_hero_fallback_image.up,
    down: migration_20260621_235225_remove_hero_fallback_image.down,
    name: '20260621_235225_remove_hero_fallback_image',
  },
  {
    up: migration_20260630_131427_add_sponsorship_tiers_and_contact_email.up,
    down: migration_20260630_131427_add_sponsorship_tiers_and_contact_email.down,
    name: '20260630_131427_add_sponsorship_tiers_and_contact_email'
  },
];
