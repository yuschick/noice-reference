import {
  Game,
  EventType,
} from '@noice-com/schemas/game-stream-events/game_stream_events.pb';
import { FormEvent, useState } from 'react';

import { GameTimelineEvent } from '../types';

import styles from './CustomEvents.module.css';

import { Button } from '@common/button';
import { TextField, Textarea, Select } from '@common/input';

interface Props {
  onAddEvent(event: GameTimelineEvent): void;
}

export function CustomEvents({ onAddEvent }: Props) {
  const [type, setType] = useState('');
  const [game, setGame] = useState('');
  const [delay, setDelay] = useState(0);

  const [attributes, setAttributes] = useState(
    JSON.stringify(
      {
        stringAttributes: {},
        intAttributes: {},
        boolAttributes: {},
      },
      undefined,
      2,
    ),
  );

  const onSubmit = (formEvent: FormEvent) => {
    formEvent.preventDefault();

    const event: GameTimelineEvent = {
      delay,
      type,
      game,
      ...JSON.parse(attributes),
    };

    onAddEvent(event);
  };

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <fieldset>
        <legend>Custom event</legend>

        <Select
          label="Game"
          options={Object.values(Game)}
          required
          onChange={setGame}
        />

        <Select
          label="Event type"
          options={Object.values(EventType)}
          required
          onChange={setType}
        />

        <Textarea
          defaultValue={attributes}
          label="Attributes"
          rows={5}
          onChange={setAttributes}
        />

        <TextField
          defaultValue={delay}
          label="Delay"
          min={0}
          step={500}
          type="number"
          onChange={(value: string) => {
            setDelay(parseInt(value, 10));
          }}
        />

        <div>
          <Button
            buttonType="success"
            disabled={!type || !game}
            text="Add event"
            type="submit"
          />
        </div>
      </fieldset>
    </form>
  );
}
