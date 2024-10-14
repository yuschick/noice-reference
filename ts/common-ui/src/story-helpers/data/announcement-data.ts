import ExampleAnnouncementImage from '../assets/example-announcement-image.png';
import { getNewId } from '../helpers';

import { AnnouncementAnnouncement, AnnouncementAnnouncementCategory } from '@common-gen';

type WithoutId = Omit<Partial<AnnouncementAnnouncement>, 'id'>;

const announcements: WithoutId[] = [
  {
    title: 'Season 1 for League of Legends streamers is almost here',
    startTime: '2023-03-03T08:10:00Z',
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mi71 purus, imperdiet vel venenatis eu, porttitor quis libero. Fusce pellentesque, velit ut sagittis vulputate, mi libero lacinia felis, vitae convallis turpis justo nec risus.

**Vivamus porta elit nibh**, id pharetra nulla sagittis sit amet. Nulla porta enim vel semper porttitor. Curabitur gravida purus non semper condimentum. Curabitur arcu velit, feugiat non dui in, auctor faucibus mauris. Vivamus facilisis odio sed odio malesuada, vitae faucibus urna sodales.
Aenean quis nunc id neque egestas ornare sed eget massa. Nam id odio in tortor interdum mattis ac eu arcu. Donec gravida arcu nec erat rhoncus hendrerit. In hac habitasse platea dictumst. Phasellus aliquam scelerisque sem, at eleifend nunc cursus id.

Pellentesque rutrum eleifend eros id egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. **Sed quis bibendum arcu**, eu commodo erat.`,
    imageUrl: ExampleAnnouncementImage,
    category: AnnouncementAnnouncementCategory.AnnouncementCategoryGameFortnite,
  },
  {
    title: 'Maintenance on Friday 17.02.2023',
    startTime: '2023-03-03T08:10:00Z',
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mi71 purus, imperdiet vel venenatis eu, porttitor quis libero. Fusce pellentesque, velit ut sagittis vulputate, mi libero lacinia felis, vitae convallis turpis justo nec risus.
    **Noice services will go temporarily offline 17.02.2023 at 12:30 CET.**`,
    imageUrl: '',
    category: AnnouncementAnnouncementCategory.AnnouncementCategorySystem,
  },
  {
    title: 'New DC cosmetics in the store!',
    startTime: '2023-03-03T08:10:00Z',
    text: `Elit quis Lorem cupidatat irure consectetur anim irure incididunt amet proident enim. Non do aute adipisicing culpa dolore occaecat quis occaecat dolore eu nulla id ut anim. Aute dolore consectetur elit eu do sit duis. Enim consequat ut consequat ex consectetur ut deserunt pariatur non tempor consequat occaecat voluptate incididunt.

Amet labore qui fugiat eu. Excepteur incididunt commodo non ut nisi officia adipisicing dolore. Nisi cillum id velit enim ad mollit qui excepteur amet esse. Est tempor consequat proident magna ullamco eiusmod laboris labore ea sint et dolor laboris nisi. Lorem sint adipisicing velit laboris id nulla Lorem cillum nulla est non laborum. Est aliqua qui et cupidatat tempor laboris veniam fugiat. Ex ut commodo culpa exercitation sint culpa et fugiat commodo ea dolor incididunt.

Proident id minim reprehenderit nostrud. Velit id ea tempor dolore commodo quis sit ex laborum nisi consequat deserunt velit. Officia irure in enim est officia cillum laboris magna incididunt commodo laboris adipisicing ad in. Nulla esse velit enim ullamco. Ullamco consequat consectetur nostrud sunt nisi. Velit aliqua enim et incididunt ad id ex consequat esse eiusmod.

Irure culpa sint enim elit nulla nisi et quis minim id ullamco proident mollit. Deserunt aliquip culpa nostrud eu laboris sit eu. Qui consequat sint id deserunt. Et commodo sint aliquip laborum occaecat in est quis veniam do. Magna sit ea non fugiat anim ipsum fugiat elit cupidatat.`,
    imageUrl: '',
    category: AnnouncementAnnouncementCategory.AnnouncementCategoryUnspecified,
  },
];

function* announcementGenFn(): Generator<WithoutId> {
  let index = 0;

  while (true) {
    yield announcements[index++ % announcements.length];
  }
}

const announcementGen = announcementGenFn();

// The function always gets the next profile from the array above. If last one asked
// was the last, then first one is returned again
export const getNewAnnouncement = <T extends Partial<AnnouncementAnnouncement>>(): T => ({
  ...announcementGen.next().value,
  id: `${getNewId()}`,
});
