import {
        IApp,
        ISyncLog,
        ISyncEvent,
        WhatEvent,
        ITask,
        ILabel,
        ILabelCreate,
        IDomainObjectDeleteEvent
    }
    from "../interfaces";
import { R } from "../common";


export class SyncLog implements ISyncLog {


    private readonly ses: ISyncEvent[];


    constructor(private readonly app: IApp) {
        this.ses = [];
        this.setupSync();
    }


    private setupSync() {

        R.onArrayChange(this.app.data.labels,
            (l) => this.pushLabelCreate(l),
            (l) => this.pushLabelRemove(l));

        R.onArrayChange(this.app.data.tasks,
            (t) => this.pushTaskCreate(t),
            (t) => this.pushTaskRemove(t));

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


    pushLabelCreate(l: ILabel): void {
        const d: ILabelCreate = {
            id: l.id,
            createdOn: l.createdOn.value,
            name: l.name,
            style: {
                backColor: l.style.backColor.value,
                customTextColor: l.style.customTextColor.value,
                textColorInUse: l.style.textColorInUse
            }
        };
        this.push(WhatEvent.LabelCreate, d);
    }


    pushLabelRemove(l: ILabel): void {
        const d: IDomainObjectDeleteEvent = { id: l.id };
        this.push(WhatEvent.LabelDelete, d);
    }

    pushTaskCreate(t: ITask): void {

    }


    pushTaskRemove(t: ITask): void {
        const d: IDomainObjectDeleteEvent = { id: t.id };
        this.push(WhatEvent.TaskDelete, d);
    }
}