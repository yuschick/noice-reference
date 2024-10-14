export interface DebugViewLogEntry {
  eventName: string;
  jsonData: { [key: string]: unknown };
  isError: boolean;
}

export interface DebugViewLogRow {
  timestamp: number;
  mlEvent: DebugViewLogEntry | null;
  serverEvent: DebugViewLogEntry | null;
  clientEvent: DebugViewLogEntry | null;
}

export interface DebugListener {
  onSubscribe(groups: DebugViewLogRow[]): void;
  onDebugRow(group: DebugViewLogRow): void;
}
