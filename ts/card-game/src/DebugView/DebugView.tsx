import {
  SoundController,
  SoundControllerProvider,
  InputField,
  Checkbox,
  Button,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useState, useEffect, useRef, CSSProperties } from 'react';

import styles from './DebugView.module.css';

import { GameLocalStorageKeys, DebugViewLogRow } from '@game-types';

export function DebugView(): JSX.Element | null {
  const [logRows, setLogRows] = useState<DebugViewLogRow[]>([]);
  const [openEvents, setOpenEvents] = useState<number[]>([]);
  const [filter, setFilter] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [columWidth, setColumnWidth] = useState<number>(33.333);

  const soundController = new SoundController<GameLocalStorageKeys>();
  window.NOICE.__SoundController = soundController;

  const [showOpts, setShowOpts] = useState<[boolean, boolean, boolean]>([
    true,
    true,
    true,
  ]);

  const addLogRow = useCallback((row: DebugViewLogRow) => {
    setLogRows((prevRows) => {
      const newRows = [...prevRows, row];

      return newRows;
    });
  }, []);

  useEffect(() => {
    window.NOICE.onDebugViewStart = (addDebugListener) => {
      const unsub = addDebugListener({
        onDebugRow: (row: DebugViewLogRow) => addLogRow(row),
        // @todo: There can be duplicate events unless we do adding like this
        onSubscribe: (rows: DebugViewLogRow[]) =>
          rows.forEach((value) => addLogRow(value)),
      });

      window.addEventListener('beforeunload', () => {
        unsub?.();
      });
    };
  }, [addLogRow]);

  const toggleEvent = useCallback(
    (index: number) => {
      const eIndex = openEvents.indexOf(index);

      if (eIndex > -1) {
        setOpenEvents((prevOpenEvents) => {
          const newEvents = [...prevOpenEvents];
          newEvents.splice(eIndex, 1);
          return newEvents;
        });
      } else {
        setOpenEvents((prevOpenEvents) => {
          return [...prevOpenEvents, index];
        });
      }
    },
    [openEvents],
  );

  const checkAutoScroll = useCallback(() => {
    if (
      scrollRef.current !== null &&
      openEvents.length === 0 &&
      scrollRef.current.scrollTop ===
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight
    ) {
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
  }, [openEvents]);

  const handleScroll = useCallback(() => {
    checkAutoScroll();
  }, [checkAutoScroll]);

  useEffect(() => {
    checkAutoScroll();
  }, [checkAutoScroll, openEvents]);

  useEffect(() => {
    if (autoScroll && scrollRef.current !== null) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
  }, [autoScroll, logRows]);

  const changeOpt = useCallback((index: number, state: boolean) => {
    setShowOpts((prevOpts) => {
      const newOpts: [boolean, boolean, boolean] = [...prevOpts];
      newOpts[index] = state;
      setColumnWidth(100 / newOpts.filter((show) => show).length);
      return newOpts;
    });
  }, []);

  const onShowMLChange = useCallback(
    (checked: boolean) => changeOpt(0, checked),
    [changeOpt],
  );
  const onShowServerChange = useCallback(
    (checked: boolean) => changeOpt(1, checked),
    [changeOpt],
  );
  const onShowClientChange = useCallback(
    (checked: boolean) => changeOpt(2, checked),
    [changeOpt],
  );

  return (
    <SoundControllerProvider soundController={soundController}>
      <div
        className={styles.container}
        style={
          {
            '--debug-view-column-width': `${columWidth}%`,
          } as CSSProperties
        }
      >
        <div className={styles.toolsContainer}>
          <InputField
            label="Filter"
            name="filter"
            size="lg"
            type="text"
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className={styles.checkboxesContainer}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                checked={showOpts[0]}
                label="Show ML events"
                labelType="hidden"
                name="showMl"
                value="showMl"
                onChange={(event) => onShowMLChange(event.target.checked)}
              />
              <span className={styles.fakeCheckboxLabel}>Show ML events</span>
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                checked={showOpts[1]}
                label="Show server events"
                labelType="hidden"
                name="showServer"
                value="showServer"
                onChange={(event) => onShowServerChange(event.target.checked)}
              />
              <span className={styles.fakeCheckboxLabel}>Show server events</span>
            </div>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                checked={showOpts[2]}
                label="Show client events"
                labelType="hidden"
                name="showClient"
                value="showClient"
                onChange={(event) => onShowClientChange(event.target.checked)}
              />
              <span className={styles.fakeCheckboxLabel}>Show client events</span>
            </div>
          </div>
          <Button
            isDisabled={openEvents.length === 0}
            variant="cta"
            onClick={() => setOpenEvents([])}
          >
            Close all events
          </Button>
        </div>
        <div className={styles.eventTypesContainer}>
          {showOpts[0] && (
            <div className={styles.eventTypeContainer}>Machine Learning</div>
          )}
          {showOpts[1] && <div className={styles.eventTypeContainer}>Server</div>}
          {showOpts[2] && <div className={styles.eventTypeContainer}>Client</div>}
        </div>
        <div
          className={styles.eventContainer}
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {logRows &&
            logRows.map((row, index) => {
              const baseId = (index + 1) * 100000;
              const mlEntryId = baseId + (index + 1);
              const sEntryId = baseId + (index + 1) * 10;
              const cEntryId = baseId + (index + 1) * 100;

              return (
                <div
                  className={styles.eventRow}
                  key={`group_${index}`}
                >
                  {row.mlEvent &&
                  showOpts[0] &&
                  (filter !== ''
                    ? row.mlEvent.eventName.toUpperCase().includes(filter.toUpperCase())
                    : true) ? (
                    <div
                      className={styles.event}
                      key={`mlEntry_${mlEntryId}`}
                    >
                      <button
                        className={styles.eventTopic}
                        onClick={() => toggleEvent(mlEntryId)}
                      >
                        {row.mlEvent.eventName}
                      </button>
                      {openEvents.includes(mlEntryId) && (
                        <code className={styles.eventContent}>
                          {JSON.stringify(row.mlEvent.jsonData ?? '{}', null, 2)}
                        </code>
                      )}
                    </div>
                  ) : (
                    <div
                      className={styles.event}
                      style={
                        {
                          '--debug-view-column-width': `${showOpts[0] ? columWidth : 0}%`,
                        } as CSSProperties
                      }
                    />
                  )}

                  {row.serverEvent &&
                  showOpts[1] &&
                  (filter !== ''
                    ? row.serverEvent.eventName
                        .toUpperCase()
                        .includes(filter.toUpperCase())
                    : true) ? (
                    <div
                      className={styles.event}
                      key={`sEntry_${sEntryId}`}
                    >
                      <button
                        className={styles.eventTopic}
                        onClick={() => toggleEvent(sEntryId)}
                      >
                        {row.serverEvent.eventName}
                      </button>
                      {openEvents.includes(sEntryId) && (
                        <code className={styles.eventContent}>
                          {JSON.stringify(
                            { ...row.serverEvent.jsonData, time: row.timestamp } ?? '{}',
                            null,
                            2,
                          )}
                        </code>
                      )}
                    </div>
                  ) : (
                    <div
                      className={styles.event}
                      style={
                        {
                          '--debug-view-column-width': `${showOpts[1] ? columWidth : 0}%`,
                        } as CSSProperties
                      }
                    />
                  )}

                  {row.clientEvent &&
                  showOpts[2] &&
                  (filter !== ''
                    ? row.clientEvent.eventName
                        .toUpperCase()
                        .includes(filter.toUpperCase())
                    : true) ? (
                    <div
                      className={styles.event}
                      key={`cEntry_${cEntryId}`}
                    >
                      <button
                        className={classNames(styles.eventTopic, {
                          [styles.error]: row.clientEvent.isError,
                        })}
                        onClick={() => toggleEvent(cEntryId)}
                      >
                        {row.clientEvent.eventName}
                      </button>
                      {openEvents.includes(cEntryId) && (
                        <code className={styles.eventContent}>
                          {JSON.stringify(
                            { ...row.clientEvent.jsonData, time: row.timestamp } ?? '{}',
                            null,
                            2,
                          )}
                        </code>
                      )}
                    </div>
                  ) : (
                    <div
                      className={styles.event}
                      style={
                        {
                          '--debug-view-column-width': `${showOpts[2] ? columWidth : 0}%`,
                        } as CSSProperties
                      }
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </SoundControllerProvider>
  );
}
