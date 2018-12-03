import { IApp, ISyncLog, ISyncEvent, WhatEvent } from "../interfaces";


export class SyncLog implements ISyncLog {


    private readonly ses: ISyncEvent[];


    constructor(private readonly app: IApp) {

        const ls = app.data.labels;
        this.ses = [];
        //R.on(ls, (l : ILabel) => { return l}, true);
    }


    push(we: WhatEvent, data: any) {
        const se: ISyncEvent = {
            id: this.app.idCounter.getNext(),
            on: this.app.clock.now().value,
            what: we,
            data: data
        };
        this.ses.push(se);
        console.log(se);
    }
}