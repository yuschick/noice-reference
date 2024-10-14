import {
  EventType,
  Game,
} from '@noice-com/schemas/game-stream-events/game_stream_events.pb';
import { FormEvent, useState } from 'react';

import { BooleanAttributeField } from '../BooleanAttributeField/BooleanAttributeField';
import { IntAttributeField } from '../IntAttributeField/IntAttributeField';
import { StringAttributeField } from '../StringAttributeField/StringAttributeField';
import { GameTimelineEvent } from '../types';

import {
  booleanAttributesForEvent,
  fortniteEventTypes,
  intAttributesForEvent,
  stringAttributesForEvent,
} from './events';

import { Button } from '@common/button';
import { TextField, Select } from '@common/input';

interface Props {
  onAddEvent(event: GameTimelineEvent): void;
}

export function FortniteEvents({ onAddEvent }: Props) {
  const [type, setType] = useState('');
  const [stringAttributes, setStringAttributes] = useState<Record<string, string>>({});
  const [intAttributes, setIntAttributes] = useState<Record<string, number>>({});
  const [boolAttributes, setBoolAttributes] = useState<Record<string, boolean>>({});
  const [delay, setDelay] = useState(0);

  const eventStringAttributes =
    (type && stringAttributesForEvent.find((attr) => attr.type === type)) || undefined;

  const eventIntAttributes =
    (type && intAttributesForEvent.find((attr) => attr.type === type)) || undefined;

  const eventBooleanAttributes =
    (type && booleanAttributesForEvent.find((attr) => attr.type === type)) || undefined;

  const onSubmit = (formEvent: FormEvent) => {
    formEvent.preventDefault();

    if (!type) {
      return;
    }

    const event: GameTimelineEvent = {
      delay,
      type: type as EventType,
      game: Game.GAME_FORTNITE,
      stringAttributes,
      intAttributes,
      boolAttributes,
      globals: [],
    };

    onAddEvent(event);
  };

  const onTypeChange = (type: string) => {
    setType(type);
    setStringAttributes({});
    setIntAttributes({});
    setBoolAttributes({});
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>Fortnite events template</legend>

        <Select
          label="Event"
          options={fortniteEventTypes}
          required
          onChange={onTypeChange}
        />

        <fieldset>
          <legend>Attributes</legend>

          {eventStringAttributes?.attributes.map((attr, index) => (
            <StringAttributeField
              attribute={attr}
              key={index}
              onChange={(value) => {
                setStringAttributes((prev) => ({ ...prev, ...value }));
              }}
            />
          ))}

          {eventIntAttributes?.attributes.map((attr, index) => (
            <IntAttributeField
              attribute={attr}
              key={index}
              onChange={(value) => {
                setIntAttributes((prev) => ({ ...prev, ...value }));
              }}
            />
          ))}

          {eventBooleanAttributes?.attributes.map((attr, index) => (
            <BooleanAttributeField
              attribute={attr}
              key={index}
              onChange={(value) => setBoolAttributes((prev) => ({ ...prev, ...value }))}
            />
          ))}
        </fieldset>

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
            disabled={!type}
            text="Add event"
            type="submit"
          />
        </div>
      </fieldset>
    </form>
  );
}
