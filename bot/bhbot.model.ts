import { Chat } from "@telegraf/types";

export interface BotConfig {
    subscribers: Chat[],
    messageQueue: string[];
}