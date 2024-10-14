import { useClient } from '@noice-com/common-react-core';
import { Icon } from '@noice-com/common-ui';
import { GameStreamEvent } from '@noice-com/schemas/game-stream-events/game_stream_events.pb';
import { DateAndTimeUtils } from '@noice-com/utils';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { BiBroadcast, BiError } from 'react-icons/bi';

import { ChannelSelectorDrawer } from './ChannelSelectorDrawer/ChannelSelectorDrawer';
import { CustomEvents } from './CustomEvents/CustomEvents';
import { FortniteEvents } from './FortniteEvents/FortniteEvents';
import styles from './GameEvents.module.css';
import { GameTimelineEvent } from './types';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { Textarea } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { Table } from '@common/table';
import { ChannelSelectorChannelFragment } from '@gen';

export function GameEvents() {
  const client = useClient();
  const { closeDrawer } = useDrawer();

  const timelineTextarea = useRef<HTMLTextAreaElement>(null);

  const [channel, setChannel] = useState<ChannelSelectorChannelFragment>();
  const [timeline, setTimeline] = useState<GameTimelineEvent[]>([]);
  const [timelineValue, setTimelineValue] = useState(
    JSON.stringify(timeline, undefined, 2),
  );
  const [events, setEvents] = useState<GameStreamEvent[]>([]);
  const [timelineOn, setTimelineOn] = useState(false);
  const [parseError, setParseError] = useState<string>();
  const eventId = useRef(1);

  useEffect(() => {
    if (!timelineTextarea.current) {
      return;
    }

    timelineTextarea.current.value = JSON.stringify(timeline, undefined, 2);
  }, [timeline]);

  useEffect(() => {
    try {
      const timeline = JSON.parse(timelineValue);
      setParseError(undefined);

      setTimeline((prev) => {
        // If data is same, do nothing
        if (JSON.stringify(prev) === JSON.stringify(timeline)) {
          return prev;
        }

        return JSON.parse(timelineValue);
      });
    } catch (e: any) {
      setParseError(e.message);
    }
  }, [timelineValue]);

  const onChannelChange = (channel: ChannelSelectorChannelFragment) => {
    setChannel(channel);
    closeDrawer();
  };

  const onTimelineSubmit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    sendEvent(0);
    setTimelineOn(true);
  };

  const sendEvent = async (index: number) => {
    if (!channel) {
      return;
    }

    const timelineEvent = timeline[index];

    // No more events to run
    if (!timelineEvent) {
      setTimelineOn(false);
      showSnackbar('info', 'All events sent');
      return;
    }

    setTimeout(async () => {
      const event = {
        ...timelineEvent,
        streamId: channel.id,
        id: `${eventId.current++}`,
        time: `${Date.now()}`,
      };

      try {
        await client.GameEventsService.sendEvent(event);
        setEvents((prev) => [...prev, event]);
      } catch (e) {
        showSnackbar('error', 'Sending event failed');
      }

      sendEvent(index + 1);
    }, timelineEvent.delay);
  };

  return (
    <ContentModulePage
      drawer={{
        title: 'Select channel',
        content: (
          <ChannelSelectorDrawer
            selectedChannel={channel}
            onChannelChange={onChannelChange}
          />
        ),
      }}
      drawerAction={{ text: 'Select channel', icon: BiBroadcast }}
      titleSuffix={channel?.name ? `- ${channel.name}` : undefined}
    >
      <ContentModulePage.Content title="Add events">
        <FortniteEvents
          onAddEvent={(event) => {
            setTimeline((prev) => [...prev, event]);
          }}
        />

        <CustomEvents
          onAddEvent={(event) => {
            setTimeline((prev) => [...prev, event]);
          }}
        />
      </ContentModulePage.Content>

      <ContentModulePage.Content title="Timeline">
        <form
          className={styles.timelineForm}
          onSubmit={onTimelineSubmit}
        >
          <Textarea
            className={styles.timelineField}
            defaultValue={timelineValue}
            label="Timeline"
            ref={timelineTextarea}
            onChange={setTimelineValue}
          />

          <div className={styles.timelineButtons}>
            <Button
              buttonType="success"
              disabled={!channel || timelineOn}
              text="Start timeline"
              type="submit"
            />

            <Button
              buttonType="ghost"
              text="Clear timeline"
              type="button"
              onClick={() => {
                setTimeline([]);
              }}
            />

            {!channel && (
              <div className={styles.warning}>
                <Icon
                  className={styles.icon}
                  icon={BiError}
                />

                <span>No channel selected</span>
              </div>
            )}

            {!!parseError && (
              <div className={styles.warning}>
                <Icon
                  className={styles.icon}
                  icon={BiError}
                />

                <span>{parseError}</span>
              </div>
            )}
          </div>
        </form>
      </ContentModulePage.Content>

      <ContentModulePage.Content title="Event log">
        {!!events.length && (
          <Table
            caption="Game events log"
            data={events.reverse().map((event) => ({
              type: event.type,
              time: event.time
                ? DateAndTimeUtils.getTime(parseInt(event.time, 10), {
                    showSeconds: true,
                  })
                : undefined,
            }))}
          />
        )}
      </ContentModulePage.Content>
    </ContentModulePage>
  );
}
