import { gql } from '@apollo/client';
import { Button, TextArea } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { FormEvent, useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { ChannelUrl } from './ChannelUrl/ChannelUrl';
import styles from './SettingsChannelDetails.module.css';
import { SocialLinksForm } from './SocialLinks/SocialLinksForm';

import { useChannelContext } from '@common/channel';
import { PageHeading, LayoutBox, SubHeading } from '@common/layout';
import {
  ChannelChannel,
  ChannelChannelLink,
  ChannelChannelLinkLinkType,
  useSettingsChannelQuery,
  useUpdateChannelDetailsMutation,
} from '@gen';

gql`
  query SettingsChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      description
      name
      title
      links {
        name
        type
        url
      }
    }
  }
`;

gql`
  mutation UpdateChannelDetails(
    $channelId: ID!
    $title: String
    $description: String
    $links: [ChannelChannelLinkInput!]
  ) {
    updateChannelDetails(
      body: { id: $channelId, title: $title, description: $description, links: $links }
    ) {
      ...ChannelInfoUpdate
    }
  }
`;

const socialLinksRegexMap: Record<ChannelChannelLinkLinkType, Nullable<RegExp>> = {
  [ChannelChannelLinkLinkType.LinkTypeDiscord]:
    /^(https:\/\/)?(?:www\.)?discord\.gg\/([a-zA-Z0-9_]+)/,
  [ChannelChannelLinkLinkType.LinkTypeTwitter]:
    /^(https:\/\/)?(?:www\.)?(twitter|x)\.com\/([a-zA-Z0-9_]+)/,
  [ChannelChannelLinkLinkType.LinkTypeYoutube]:
    /^(https:\/\/)?(?:www\.)?youtube\.(?:com|co)\/([a-zA-Z0-9_@]+)/,
  [ChannelChannelLinkLinkType.LinkTypeFacebook]:
    /^(https:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_@]+)/,
  [ChannelChannelLinkLinkType.LinkTypeInstagram]:
    /^(https:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_@]+)/,
  [ChannelChannelLinkLinkType.LinkTypeTiktok]:
    /^(https:\/\/)?(?:www\.)?tiktok\.com\/([a-zA-Z0-9_@]+)/,
  [ChannelChannelLinkLinkType.LinkTypeCustom]: null,
  [ChannelChannelLinkLinkType.LinkTypeUnspecified]: null,
};

const getInvalidLink = (
  links: ChannelChannelLink[],
): Nullable<ChannelChannelLinkLinkType> =>
  links.find(({ type, url }) =>
    url && socialLinksRegexMap[type] ? !socialLinksRegexMap[type]?.test(url) : false,
  )?.type ?? null;

export function SettingsChannelDetails() {
  const id = useId();
  const { channelId } = useChannelContext();
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [description, setDescription] = useState<string>();
  const [links, setLinks] = useState<ChannelChannelLink[]>([]);

  const { data } = useSettingsChannelQuery({
    variables: { channelId },
  });
  const [updateChannelSettings] = useUpdateChannelDetailsMutation({
    onCompleted: () => {
      toast.success('Channel updated successfully!');
    },
    onError(error) {
      if (error.message === 'channel description failed moderation check') {
        toast.error(
          "The text you entered in the channel bio may be against Noice's community guidelines. Please edit the text and try again.",
          {
            id,
            ariaProps: {
              role: 'alert',
              'aria-live': 'assertive',
            },
          },
        );

        descriptionRef.current?.setAttribute('aria-invalid', 'true');
        descriptionRef.current?.setAttribute('aria-errormessage', id);

        return;
      }

      toast.error('Something went wrong: ' + error.message);
    },
    update(cache, { data }) {
      cache.updateFragment(
        {
          id: cache.identify({ __typename: 'ChannelChannel', id: channelId }),
          fragment: gql`
            fragment ChannelInfoUpdate on ChannelChannel {
              id
              description
              links {
                name
                type
                url
              }
            }
          `,
        },
        (existing: Nullable<Partial<ChannelChannel>>) => ({
          ...existing,
          ...data?.updateChannelDetails,
          links: [
            ...(existing?.links?.filter((link) =>
              data?.updateChannelDetails?.links.every(
                (updatedLink) => updatedLink.type !== link.type,
              ),
            ) ?? []),
            ...(data?.updateChannelDetails?.links ?? []),
          ],
        }),
      );
    },
  });

  const channel = data?.channel;

  const onSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    formRef.current?.querySelectorAll('[aria-invalid="true"]').forEach((element) => {
      element.removeAttribute('aria-invalid');
      element.removeAttribute('aria-errormessage');
    });

    const invalidLink = getInvalidLink(links);

    if (invalidLink) {
      const invalidLinkInput = formRef.current?.querySelector(`[name='${invalidLink}']`);

      invalidLinkInput?.setAttribute('aria-invalid', 'true');
      invalidLinkInput?.setAttribute('aria-errormessage', id);

      toast.error('An unsupported URL was entered.', {
        id,
        ariaProps: {
          role: 'alert',
          'aria-live': 'assertive',
        },
      });

      return;
    }

    updateChannelSettings({
      variables: {
        channelId,
        description: description === channel?.description ? undefined : description,
        links: !links.length ? undefined : links,
      },
    });
  };

  if (!channel) {
    return null;
  }

  return (
    <>
      <PageHeading title="Channel details" />

      <form
        className={styles.form}
        ref={formRef}
        onSubmit={onSave}
      >
        <LayoutBox>
          <div className={styles.blockContent}>
            <div className={styles.channelNameWrapper}>
              <span>Channel name</span>
              <span className={styles.channelName}>{channel.name}</span>
            </div>

            <TextArea
              defaultValue={channel.description}
              description="Enter the description of your channel"
              label="Channel bio"
              maxLength={250}
              ref={descriptionRef}
              rows={5}
              theme="gray"
              showCharacterCount
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles.channelUrls}>
              <ChannelUrl
                label="Channel url"
                url={`${NOICE.PLATFORM_URL}/${channel.name.toLowerCase()}`}
              />
              <ChannelUrl
                label="Rss feed"
                url={`${NOICE.SERVICES_LIB_HOST}/v1/channels/${channelId}/rss/channel_live.xml`}
              />
            </div>
          </div>
        </LayoutBox>

        <section className={styles.links}>
          <SubHeading title="Social links" />

          <LayoutBox>
            <SocialLinksForm
              links={channel.links}
              onChange={setLinks}
            />
          </LayoutBox>
        </section>

        <div className={styles.saveButton}>
          <Button
            size="md"
            type="submit"
            variant="cta"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
