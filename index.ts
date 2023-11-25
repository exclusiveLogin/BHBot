import dotenv from "dotenv";
dotenv.config();
import { Chat } from "@telegraf/types";
import { BHBot } from "./bot/bhbot";
import { EventDispatcher } from "./events/driver";
import { DataBaseService } from "./sql/sql";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const subscribers: Chat[] = [];
const actions: string[] = [];
let token = process.env["BHBOTTOKEN"] ?? "token not defined";
let version = "0.2.1";

const BhBot = new BHBot(token, {
  messageQueue: actions,
  subscribers,
});

const dbDriver = new DataBaseService();

const dispatcher = new EventDispatcher(dbDriver, {});

// process.on("SIGINT", () => {
//   bot.telegram
//     .sendMessage(hgChatId, "Сервис бота остановлен")
//     .finally(() => process.exit());
// });
