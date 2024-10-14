import { useClient } from '@noice-com/common-react-core';
import {
  CommonUtils,
  useAuthenticatedUser,
  InputField,
  Button,
  LoadingSpinner,
} from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import {
  ChangeEventHandler,
  DragEventHandler,
  FormEventHandler,
  MouseEventHandler,
  Suspense,
  lazy,
  useCallback,
  useState,
} from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './AvatarAdmin.module.css';

import { useAfterAuth } from '@common/auth';

const AvatarRenderer = lazy(() =>
  import('@noice-com/common-ui/src/components/AvatarRenderer').then((module) => ({
    default: module.AvatarRenderer,
  })),
);

const { logError } = makeLoggers('AVATAR ADMIN');

const AVATAR_SEPARATOR = '|';

export function AvatarAdmin() {
  const [processing, setProcessing] = useState<boolean>(false);
  const { userId } = useAuthenticatedUser();
  const [avatar3D, setAvatar3d] = useState<string>('');
  const [avatar2D, setAvatar2d] = useState<string>('');
  const [avatarFullBody, setAvatarFullBody] = useState<string>('');
  const [avatarOverrideURL, setAvatarOverrideURL] = useState<string>('');

  const client = useClient();

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (processing || !userId) {
      return;
    }

    setProcessing(true);

    try {
      await client.ProfileService.updateProfile({
        userId,
        avatarUrl: [avatar2D, avatar3D, avatarFullBody].join(AVATAR_SEPARATOR),
      });
    } catch (e) {
      logError(e);
    } finally {
      setProcessing(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    const profile = await client.ProfileService.getProfile(userId);
    setAvatar3d(profile?.avatars?.avatar3D || '');
    setAvatar2d(profile?.avatars?.avatar2D || '');
    setAvatarFullBody(profile?.avatars?.avatarFullbody || '');
  }, [userId, client]);

  useAfterAuth(fetchProfile);

  const onLocalOverrideChanged: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    await CommonUtils.setAvatarOverride(file);
    setAvatarOverrideURL((await CommonUtils.getAvatarOverride()) || '');
  };

  useAfterAuth(async () => {
    setAvatarOverrideURL((await CommonUtils.getAvatarOverride()) || '');
  });

  const onAvatarDrop: DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];

    if (!file) {
      return;
    }

    await CommonUtils.setAvatarOverride(file);
    setAvatarOverrideURL((await CommonUtils.getAvatarOverride()) || '');
  };

  const onAvatarDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onResetButtonClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await CommonUtils.resetAvatarOverride();
    setAvatarOverrideURL('');
  };

  return (
    <div className={styles.contentWrapper}>
      <Helmet>
        <title>Avatar / Admin</title>
      </Helmet>
      <h2 className={styles.title}>Avatar URL Admin</h2>

      <p className={styles.body}>{'Input a full CDN urls for avatars'}</p>

      <form onSubmit={onFormSubmit}>
        <div className={styles.inputs}>
          <InputField
            label="3D Avatar URL"
            size="lg"
            type="text"
            onChange={(event) => setAvatar3d(event.target.value)}
          />

          <InputField
            label="2D Avatar URL"
            size="lg"
            type="text"
            onChange={(event) => setAvatar2d(event.target.value)}
          />

          <InputField
            label="FullBody Avatar URL"
            size="lg"
            type="text"
            onChange={(event) => setAvatarFullBody(event.target.value)}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            isDisabled={processing}
            size="lg"
            type="submit"
            variant="cta"
          >
            Update avatars
          </Button>
        </div>
      </form>

      <h2 className={styles.title}>Local Avatar Override</h2>
      <div
        onDragOver={onAvatarDragOver}
        onDrop={onAvatarDrop}
      >
        <form>
          <input
            type="file"
            onChange={onLocalOverrideChanged}
          />
        </form>
        {!!avatarOverrideURL && (
          <div className={styles.buttonWrapper}>
            <Button
              isDisabled={processing}
              type="submit"
              onClick={onResetButtonClick}
            >
              Update avatars
            </Button>
          </div>
        )}
        <Suspense fallback={<LoadingSpinner />}>
          <AvatarRenderer
            className={styles.avatarWrapper}
            url={avatarOverrideURL || avatar3D}
            disableLoadingContainer
          />
        </Suspense>
      </div>
    </div>
  );
}
