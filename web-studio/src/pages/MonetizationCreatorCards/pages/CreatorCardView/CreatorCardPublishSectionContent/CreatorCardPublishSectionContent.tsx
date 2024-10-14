import { gql } from '@apollo/client';
import { Button, Switch } from '@noice-com/common-ui';
import { FormEvent, useRef } from 'react';
import toast from 'react-hot-toast';

import { useCreateCreatorCardSaleConfig } from '../hooks/useCreateCreatorCardSaleConfig.hook';
import { useUpdateCreatorCardSaleConfig } from '../hooks/useUpdateCreatorCardSaleConfig.hook';

import styles from './CreatorCardPublishSectionContent.module.css';
import { usePublishDraftCreatorCard } from './hooks/usePublishDraftCreatorCard.hook';

import { useChannelContext } from '@common/channel';
import { CreatorCardPublishSectionCardFragment } from '@gen';

gql`
  fragment CreatorCardPublishSectionCard on GameLogicStreamerCard {
    id
    draft
    saleConfig {
      cardId
      enabled
      excludeFromBundles
    }
    video
    image
  }
`;

const SwitchLabel = () => {
  return (
    <span className={styles.labelWrapper}>
      <span>Include the card in a premium bundle</span>
      <span className={styles.labelSecondary}>
        Player will receive the creator card also if they buy a premium bundle from your
        channel store.
      </span>
    </span>
  );
};

interface Props {
  card: CreatorCardPublishSectionCardFragment;
}

export function CreatorCardPublishSectionContent({ card }: Props) {
  const { channelId } = useChannelContext();
  const { draft, saleConfig, id, video, image } = card;
  const submitSwitchRef = useRef<HTMLInputElement>(null);

  const [publishDraftCard, { loading: publishingCard }] = usePublishDraftCreatorCard({
    onError: (err) => {
      toast.error(`Creator Card creation error: ${err.message}`);
    },
  });

  const [createSaleConfig, { loading: createLoading }] = useCreateCreatorCardSaleConfig({
    onCompleted() {
      toast.success('Card published to channel store');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const [updateSaleConfig, { loading: updateLoading }] = useUpdateCreatorCardSaleConfig({
    onCompleted(_, clientOptions) {
      if (typeof clientOptions?.variables?.enable === 'boolean') {
        if (clientOptions.variables.enable) {
          toast.success('Card published to channel store');
          return;
        }

        if (!clientOptions.variables.enable) {
          toast.success('Card removed from channel store');
          return;
        }

        return;
      }

      if (!clientOptions?.variables?.excludeFromBundles) {
        toast.success('Card added to bundles');
        return;
      }

      if (clientOptions?.variables?.excludeFromBundles) {
        toast.success('Card removed from bundles');
        return;
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (draft) {
      await publishDraftCard({
        variables: {
          channelId,
          cardId: id,
        },
      });

      createSaleConfig({
        variables: {
          cardId: id,
          enabled: true,
          channelId,
          excludeFromBundles: !submitSwitchRef.current?.checked,
        },
      });

      return;
    }

    if (!saleConfig) {
      createSaleConfig({
        variables: {
          cardId: id,
          enabled: true,
          channelId,
          excludeFromBundles: !submitSwitchRef.current?.checked,
        },
      });
      return;
    }

    updateSaleConfig({
      variables: {
        cardId: id,
        channelId,
        enabled: true,
        excludeFromBundles: !submitSwitchRef.current?.checked,
      },
    });
  };

  const onPublishedSwitchChange = (event: FormEvent<HTMLInputElement>) => {
    updateSaleConfig({
      variables: {
        cardId: id,
        channelId,
        excludeFromBundles: !event.currentTarget.checked,
      },
    });
  };

  if (draft || !saleConfig?.enabled) {
    return (
      <form
        className={styles.form}
        onSubmit={onFormSubmit}
      >
        <Switch
          isLoading={createLoading || updateLoading || publishingCard}
          label={<SwitchLabel />}
          ref={submitSwitchRef}
          defaultChecked
        />

        {draft && (
          <div className={styles.dratWarning}>
            After publishing your card, you can’t edit its content anymore.
          </div>
        )}

        <div className={styles.buttonWrapper}>
          <Button
            isDisabled={!video || !image}
            isLoading={createLoading || updateLoading || publishingCard}
            size="sm"
            type="submit"
            variant="cta"
          >
            Publish to Channel store
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Switch
      defaultChecked={saleConfig?.enabled && !saleConfig?.excludeFromBundles}
      label={<SwitchLabel />}
      onChange={onPublishedSwitchChange}
    />
  );
}
