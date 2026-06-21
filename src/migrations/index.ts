import * as migration_20260421_234835_rename_eventsLanding_to_pageHero from './20260421_234835_rename_eventsLanding_to_pageHero';
import * as migration_20260620_154019_event_images_and_partner_categories from './20260620_154019_event_images_and_partner_categories';

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
];
