import { DataBaseService } from "../sql/sql";
import { EventDispatcherConfig } from "./config";

export class EventDispatcher {
  constructor(
    private db: DataBaseService,
    private config: EventDispatcherConfig
  ) {
    this.#init();
  }

  active = false;

  #init(): void {
    setInterval(() => {
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
    const q = `SELECT * FROM ${this.config.dbTableName} WHERE status = 'pending' LIMIT ${this.config.portion ?? 20}`;
    const actionList = await this.db.queryList(q).toPromise();
  }
}
