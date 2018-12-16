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
        this.push("object.delete", d);
    }


    pushField<T extends SimpleType>(we: WhatEvent, o: IDomainObject, value?: T) {
        const d: IFieldChangeEvent = { id: o.id, value: value };
        this.push(we, d);
    }


    pushField2<T extends SimpleType>(we: WhatEvent, id: number, value?: T) {
        const d: IFieldChangeEvent = { id: id, value: value };
        this.push(we, d);
    }


    pushLabelCreate(l: ILabel): void {
        const d: ILabelCreateEvent = {
            ...this.getObject(l),
            name: l.name,
            style: this.getColorStyle(l.style)
        };
        this.push("object.create", d);
    }


    pushTaskCreate(t: ITask): void {
        const d: ITaskCreateEvent = {
            ...this.getObject(t),
            title: t.title
        };
        this.push("object.create", d);
    }


    pushNoteCreate(n: INote): void {
        const d: INoteCreateEvent = {
            ...this.getObject(n),
            text: n.text
        };
        this.push("object.create", d);
    }


    pushTabCreate(t: ITab): void {
        const d: ITabCreateEvent = {
            ...this.getObject(t),
            title: t.title,
            customStyle: t.customStyle ? this.getColorStyle(t.customStyle) : undefined
        };
        this.push("object.create", d);
    }


    private getColorStyle(s: IColorStyle): IColorStyleChangeEvent {
        return {
            backColor: s.backColor.value,
            customTextColor: s.customTextColor.value,
            textColorInUse: s.textColorInUse
        };
    }


    private getObject(o: IDomainObject) {
        return {
            type: o.type,
            id: o.id,
            createdOn: o.createdOn.value,
        };
    }
}