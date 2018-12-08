import {
        IApp,
        ISyncLog,
        ISyncEvent,
        WhatEvent,
        ITask,
        ILabel,
        ILabelCreateEvent,
        INote,
        ITab,
        ITaskCreateEvent,
        IDomainObject,
        IDeleteEvent,
        INoteCreateEvent,
        ITabCreateEvent,
        IColorStyle,
        IColorStyleChangeEvent,
        IFieldChangeEvent,
        SimpleType
    }
    from "../interfaces";


export class SyncLog implements ISyncLog {


    private readonly ses: ISyncEvent[];
    private eventIdCounter = 0;


    constructor(private readonly app: IApp) {
        this.ses = [];
    }


    private push(we: WhatEvent, data: any) {
        const se: ISyncEvent = {
            eventId: ++this.eventIdCounter,
            on: this.app.clock.now().value,
            what: we,
            data: data
        };
        this.ses.push(se);
        console.log(se);
    }


    pushDelete(o: IDomainObject): void {
        const d: IDeleteEvent = { id: o.id };
        this.push("object.remove", d);
    }


    pushField<T extends SimpleType>(we: WhatEvent, o: IDomainObject, value: T) {
        const d: IFieldChangeEvent = { id: o.id, value: value };
        this.push(we, d);
    }


    pushLabelCreate(l: ILabel): void {
        const d: ILabelCreateEvent = {
            type: l.type,
            id: l.id,
            createdOn: l.createdOn.value,
            name: l.name,
            style: this.getColorStyle(l.style)
        };
        this.push("label.style", d);
    }


    pushTaskCreate(t: ITask): void {
        const d: ITaskCreateEvent = {
            type: t.type,
            id: t.id,
            createdOn: t.createdOn.value,
            title: t.title
        };
        this.push("object.add", d);
    }


    pushNoteCreate(n: INote): void {
        const d: INoteCreateEvent = {
            type: n.type,
            id: n.id,
            createdOn: n.createdOn.value,
            text: n.text
        };
        this.push("object.add", d);
    }


    pushTabCreate(t: ITab): void {
        const d: ITabCreateEvent = {
            type: t.type,
            id: t.id,
            createdOn: t.createdOn.value,
            title: t.title,
            style: this.getColorStyle(t.style)
        };
        this.push("object.add", d);
    }


    private getColorStyle(s: IColorStyle): IColorStyleChangeEvent {
        return {
            backColor: s.backColor.value,
            customTextColor: s.customTextColor.value,
            textColorInUse: s.textColorInUse
        };
    }
}