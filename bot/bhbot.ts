import { Telegraf } from "telegraf";
import { BotConfig } from "./bhbot.model";

export class BHBot {
  constructor(private token: string, private config: BotConfig) {}
  bot: Telegraf;

  init() {
    this.bot = new Telegraf(this.token, {
      telegram: {
        // agent: new HttpsProxyAgent({port: '3128', host: '148.217.94.54'})
      },
    });
  }

  initHandlers() {
    this.bot.start((ctx) =>
      ctx.reply("Выбирай петушила", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Подписаться", callback_data: "/subscribe" },
              { text: "Отписаться", callback_data: "/unsubscribe" },
              { text: "Тестирование эхо сервера", callback_data: "/echo" },
            ],
          ],
        },
      })
    );

    this.bot.command("echo", (ctx) => ctx.reply(ctx.payload));

    this.bot.command("subscribe", (ctx) => {
      console.log("subscribe", ctx, JSON.stringify(ctx.chat, null, 2));
      if (this.config.subscribers.some((chat) => chat.id === ctx.chat.id)) {
        ctx.reply(
          "Вы уже подписаны. подписку можно удалить командой /unsubscribe"
        );
      } else {
        this.config.subscribers.push(ctx.chat);
        ctx.reply("Вы подписаны. подписку можно удалить командой /unsubscribe");
      }
    });

    this.bot.command("subscribes", (ctx) => {
      console.log("subscribes", JSON.stringify(this.config.subscribers, null, 2));
      ctx.reply("subscribes: " + JSON.stringify(this.config.subscribers, null, 2));
    });

    this.bot.command("send", (ctx) => {
      console.log("send", JSON.stringify(ctx, null, 2));
      if (this.config.subscribers.some((chat) => chat.id === ctx.chat.id)) {
        this.config.messageQueue.push(ctx.payload);
        ctx.reply(
          "Сообщение добавлено в очередь для всез подписчиков, подписку можно удалить командой /unsubscribe"
        );
      } else {
        ctx.reply(
          "Вы не подписаны.подписку можно зарегистрировать командой /subscribe"
        );
      }
    });

    this.bot.on("callback_query", (ctx) => {
      console.log("callback_query", JSON.stringify(ctx, null, 2));
    });

    this.bot.on("message", (ctx) => {
      console.log("message", JSON.stringify(ctx, null, 2));
    });    
  }

  launch() {
    this.bot.launch();
  }

  sendMessageToAllSubscribers(message: string) {

  }

  
}
