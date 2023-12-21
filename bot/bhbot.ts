import { Telegraf } from "telegraf";
import { BotConfig } from "./bhbot.model";
import { BotEvent } from "../events/config";

export class BHBot {
  constructor(private token: string, private config: BotConfig) {
    this.#init();
    this.initHandlers();
    this.launch();
  }

  bot: Telegraf;

  #createDelay(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async #factoryMessageSequence(message: string, interval = 1000) {
    if (this.config.subscribers.length) {
      for (const id of this.config.subscribers) {
        await this.#factorySender(id, message, interval);
      }
    }
  }

  #factorySender(chatId: number, message: string, delay = 1000) {
    return Promise.all([
      this.#createDelay(delay),
      this.bot.telegram.sendMessage(chatId, message),
    ]);
  }

  #init() {
    this.bot = new Telegraf(this.token, {
      telegram: {
        // agent: new HttpsProxyAgent({port: '3128', host: '148.217.94.54'})
      },
    });
  }

  subscribe(ctx): void {
    if (this.config.subscribers.some((id) => id === ctx.chat.id)) {
      ctx.reply(
        "Вы уже подписаны. подписку можно удалить командой /unsubscribe"
      );
    } else {
      this.config.subscribers.push(ctx.chat.id);
      ctx.reply("Вы подписаны. подписку можно удалить командой /unsubscribe");
    }
  }

  unsubscribe(ctx): void {
    if (this.config.subscribers.includes(ctx.chat.id)) {
      this.config.subscribers = [
        ...this.config.subscribers.filter((id) => ctx.chat.id !== id),
      ];
    } else {
      ctx.reply("Вы не подписаны на нас");
    }
  }

  initHandlers() {
    this.bot.start((ctx) => {
      const chatExist = this.config.subscribers.includes(ctx.chat?.id);

      const inline_keyboard = [];
      if (chatExist) {
        inline_keyboard.push({
          text: "Отписаться",
          callback_data: "/unsubscribe",
        });
      } else {
        inline_keyboard.push({
          text: "Подписаться",
          callback_data: "/subscribe",
        });
      }

      ctx.reply("Выберите действие", {
        reply_markup: {
          inline_keyboard: [inline_keyboard],
        },
      });
    });

    this.bot.command("subscribe", (ctx) => {
      console.log("subscribe", ctx, JSON.stringify(ctx.chat, null, 2));
      this.subscribe(ctx);
    });

    this.bot.command("unsubscribe", (ctx) => {
      console.log("unsubscribe", ctx, JSON.stringify(ctx.chat, null, 2));
      this.unsubscribe(ctx);
    });

    this.bot.command("subscribes", (ctx) => {
      console.log(
        "subscribes",
        JSON.stringify(this.config.subscribers, null, 2)
      );
      ctx.reply(
        "subscribes: " + JSON.stringify(this.config.subscribers, null, 2)
      );
    });

    this.bot.command("send", (ctx) => {
      console.log("send", JSON.stringify(ctx, null, 2));
      if (this.config.subscribers.some((id) => id === ctx.chat.id)) {
        this.config.messageQueue.push(ctx.payload);
        ctx.reply(
          "Сообщение добавлено в очередь для всех подписчиков, подписку можно удалить командой /unsubscribe"
        );
      } else {
        ctx.reply(
          "Вы не подписаны.подписку можно зарегистрировать командой /subscribe"
        );
      }
    });

    this.bot.on("callback_query", (ctx) => {
      //@ts-ignore
      const data = ctx.callbackQuery?.data;

      switch (data) {
        case "/subscribe":
          this.subscribe(ctx);
          break;
        case "/unsubscribe":
          this.unsubscribe(ctx);
          break;
        default:
      }
      ctx.answerCbQuery("ok");
      console.log("callback_query", JSON.stringify(data, null, 2));
    });

    this.bot.on("message", (ctx) => {
      console.log("message", JSON.stringify(ctx, null, 2));
    });
  }

  launch() {
    this.bot.launch();
  }

  sendMessageToAllSubscribers(message: BotEvent, delay = 1000) {
    this.#factoryMessageSequence(message.title + " " + message.text);
  }
}
