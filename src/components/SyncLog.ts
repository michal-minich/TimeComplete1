﻿import {
        IApp,
        ISyncLog,
        ISyncEvent,
        SyncChangeType,
        ITask,
        ILabel,
        ILabelCreateEvent,
        ITab,
        ITaskCreateEvent,
        IDomainObject,
        IDeleteEvent,
        ITabCreateEvent,
        IColorStyle,
        IColorStyleChangeEvent,
        IFieldChangeEvent,
        SimpleType
    }
    from "../interfaces";
import { C } from "../common";


export default class SyncLog implements ISyncLog {


    private readonly ses: ISyncEvent[];
    private eventIdCounter = 0;


    constructor(private readonly app: IApp) {
        this.ses = [];
    }


    private push(type: SyncChangeType, data: any) {
        const se: ISyncEvent = {
            eventId: ++this.eventIdCounter,
            on: this.app.clock.now().value,
            type: type,
            data: data
        };
        this.ses.push(se);
        console.log(se);
    }


    pushDelete(o: IDomainObject): void {
        C.assume(o.version >= 1);
        const d: IDeleteEvent = { id: o.id, version: o.version };
        this.push("object.delete", d);
    }


    pushField<T extends SimpleType>(type: SyncChangeType, o: IDomainObject, value?: T) {
        C.assume(o.version >= 1);
        ++o.version;
        const d: IFieldChangeEvent = { id: o.id, version: o.version, value: value };
        this.push(type, d);
    }


    pushLabelCreate(l: ILabel): void {
        C.assume(l.version === 1);
        const d: ILabelCreateEvent = {
            ...this.getObject(l),
            name: l.name,
            style: this.getColorStyle(l.style)
        };
        this.push("object.create", d);
    }


    pushTaskCreate(t: ITask): void {
        C.assume(t.version === 1);
        const d: ITaskCreateEvent = {
            ...this.getObject(t),
            title: t.title
        };
        this.push("object.create", d);
    }


    pushTabCreate(t: ITab): void {
        C.assume(t.version === 1);
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
            createdOn: o.createdOn.value
        };
    }
}