import {
        IApp,
        ISyncLog,
        ISyncEvent,
        WhatEvent,
        ITask,
        ILabel,
        ILabelCreateEvent,
        IFieldChangeEvent,
        INote,
        ITab,
        ITaskCreateEvent,
        ValueSignal
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
            (l) => this.pushLabelDelete(l));

        R.onArrayChange(this.app.data.tasks,
            (t) => this.pushTaskCreate(t),
            (t) => this.pushTaskDelete(t));

        R.onArrayChange(this.app.data.notes,
            (n) => this.pushNoteCreate(n),
            (n) => this.pushNoteDelete(n));

        R.onArrayChange(this.app.data.tabs,
            (t) => this.pushTabCreate(t),
            (t) => this.pushTabDelete(t));

        this.pushFieldChange(
            WhatEvent.TabLabelPrefixChange,
            this.app.data.settings.labelPrefix);

        this.pushFieldChange(
            WhatEvent.TabNegationOperatorChange,
            this.app.data.settings.negationOperator);

        this.pushFieldChange(
            WhatEvent.TabSelectedTabIndexChange,
            this.app.data.settings.selectedTabIndex);

        this.pushFieldChange(
            WhatEvent.TabDashboardColumnsCountChange,
            this.app.data.settings.dashboardColumnsCount);
    }


    pushFieldChange<T>(we: WhatEvent, s: ValueSignal<T>) {
        R.on(s, () => this.push(we, { value: s() }));
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
        const d: ILabelCreateEvent = {
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


    pushLabelDelete(l: ILabel): void {
        const d: IFieldChangeEvent = { value: l.id };
        this.push(WhatEvent.LabelDelete, d);
    }


    pushTaskCreate(t: ITask): void {
        const d: ITaskCreateEvent = {
            id: t.id,
            createdOn: t.createdOn.value,
        };
        this.push(WhatEvent.TaskCreate, d);
    }


    pushTaskDelete(t: ITask): void {
        const d: IFieldChangeEvent = { value: t.id };
        this.push(WhatEvent.TaskDelete, d);
    }


    pushNoteCreate(n: INote): void {
        const d: ITaskCreateEvent = {
            id: n.id,
            createdOn: n.createdOn.value,
        };
        this.push(WhatEvent.NoteCreate, d);
    }


    pushNoteDelete(n: INote): void {
        const d: IFieldChangeEvent = { value: n.id };
        this.push(WhatEvent.NoteDelete, d);
    }


    pushTabCreate(t: ITab): void {
        const d: ITaskCreateEvent = {
            id: t.id,
            createdOn: t.createdOn.value,
        };
        this.push(WhatEvent.TabCreate, d);
    }


    pushTabDelete(t: ITab): void {
        const d: IFieldChangeEvent = { value: t.id };
        this.push(WhatEvent.TabDelete, d);
    }
}