export interface EventDispatcherConfig {
  timeout?: number;
  dbTableName?: string;
  portion?: number;
}

export type BotEventType = "telegram";

export type BotEventStatus =
  | "pending"
  | "sending"
  | "completed"
  | "error"
  | "reply"
  | "cancelled";

export interface BotEvent {
  id: number;
  type: BotEventType;
  title: string;
  text: string;
  status: BotEventStatus;
  datetime_create: string;
  datetime_update: string;
}
