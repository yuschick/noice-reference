import { useBooleanFeatureFlag } from '@noice-com/common-ui';

import { Browse } from './Browse';
import { LegacyBrowse } from './legacy';

export function BrowseWrapper() {
  const [useNewBrowsePage] = useBooleanFeatureFlag('categoriesListing');

  if (useNewBrowsePage) {
    return <Browse />;
  }

  return <LegacyBrowse />;
}
