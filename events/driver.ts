import { Subject } from "rxjs";
import { DataBaseService } from "../sql/sql";
import { BotEvent, EventDispatcherConfig } from "./config";

export class EventDispatcher {
  constructor(
    private db: DataBaseService,
    private config: EventDispatcherConfig
  ) {
    this.#init();
    this.active = true;
  }

  portion$ = new Subject<BotEvent[]>();
  portion: number = this.config.portion ?? 20;
  activeQueue: BotEvent[] = [];
  active = false;

  #init(): void {
    setInterval(() => {
      if (this.active && this.activeQueue.length <= this.portion)
        this.refreshActionList();
    }, this.config.timeout ?? 30000);
  }

  startEventCatcher(): void {
    this.active = true;
  }

  stopEventCatcher(): void {
    this.active = false;
  }

  async refreshActionList() {
    const markQ = `UPDATE ${this.config.dbTableName} 
      SET status= "sending" 
      WHERE id IN 
      (SELECT id FROM ${
        this.config.dbTableName
      } WHERE status IN('pending', 'reply', 'sending') LIMIT ${
      this.portion ?? 20
    })`;
    console.log("markQ: ", markQ);
    await this.db.query(markQ).toPromise();
    const q = `SELECT * FROM ${
      this.config.dbTableName
    } WHERE status IN('sending') LIMIT ${this.portion ?? 20}`;
    console.log("q: ", q);

    const actionList = await this.db.queryList<BotEvent>(q).toPromise();
    console.log("actionList:", actionList);
    this.activeQueue.push(...actionList);


  }

  connect () {
    return this.portion$.asObservable(); 
  }
}
