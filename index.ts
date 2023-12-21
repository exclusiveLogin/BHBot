import dotenv from "dotenv";
dotenv.config();
import { BHBot } from "./bot/bhbot";
import { EventDispatcher } from "./events/driver";
import { DataBaseService } from "./sql/sql";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const subscribers: number[] = [];
const messageQueue: string[] = [];
let token = process.env["BHBOTTOKEN"] ?? "token not defined";

console.log("environment: ", JSON.stringify(process.env, null, 2));

const BhBot = new BHBot(token, {
  messageQueue: messageQueue,
  subscribers,
});

// const dbDriver = new DataBaseService();

// const dispatcher = new EventDispatcher(dbDriver, {
//   dbTableName: "bot_messages",
//   portion: 20,
//   timeout: 30000,
// });

// const eventBus$ = dispatcher.connect();

// eventBus$.subscribe(async (events) => {
//   if(events?.length) {
//     for (let ev of events) {
//       await BhBot.sendMessageToAllSubscribers(ev);
//     } 
//   }
// });

// process.on("SIGINT", () => {
//   bot.telegram
//     .sendMessage(hgChatId, "Сервис бота остановлен")
//     .finally(() => process.exit());
// });
