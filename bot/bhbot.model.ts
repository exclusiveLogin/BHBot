import { Chat } from "@telegraf/types";

export interface BotConfig {
    subscribers: number[],
    messageQueue: string[];
}