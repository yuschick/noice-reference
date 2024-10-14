import { ConfirmDialog } from '@noice-com/common-ui';

import { useMatureRatedContentDialogStores } from '../context';

import { MatureRatedContentWarningDialog } from './MatureRatedContentWarningDialog';

export function MatureRatedContentDialogs() {
  const {
    matureRatedContentNotAllowedDialogStore,
    matureRatedContentImplicitAccountDialogStore,
  } = useMatureRatedContentDialogStores();

  return (
    <>
      <ConfirmDialog store={matureRatedContentNotAllowedDialogStore} />

      <ConfirmDialog store={matureRatedContentImplicitAccountDialogStore} />

      <MatureRatedContentWarningDialog />
    </>
  );
}
