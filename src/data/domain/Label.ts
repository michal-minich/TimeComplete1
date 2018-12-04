import {
        ILabel,
        IColorStyle,
        ValueSignal,
        IApp,
        IDateTime,
        WhatEvent,
        ILabelChangeName,
        ILabelCreate,
        ILabelChangeStyle
    } from
    "../../interfaces";
import { R } from "../../common";


export default class Label implements ILabel {

    private constructor(
        private readonly app: IApp,
        name: string,
        readonly style: IColorStyle,
        id: number,
        createdOn: IDateTime) {

        this.nameSignal = R.data(name);
        this.style = style;
        this.id = id;
        this.createdOn = createdOn;
        //this.associatedLabels = R.array();
    }


    static createNew(app: IApp, name: string, style: IColorStyle): ILabel {
        const l = new Label(app, name, style, app.idCounter.getNext(), app.clock.now());
        return l;
    }


    static createFromStore(app: IApp,
        name: string,
        style: IColorStyle,
        id: number,
        createdOn: IDateTime): ILabel {

        return new Label(app, name, style, id, createdOn);
    }


    private readonly nameSignal: ValueSignal<string>;


    id: number;
    createdOn: IDateTime;
    //readonly associatedLabels: WritableArraySignal<ILabel>;


    get name(): string { return this.nameSignal(); }

    set name(value: string) {
        if (this.nameSignal() === value)
            return;
        const d: ILabelChangeName = { name: value };
        this.app.sync.push(WhatEvent.LabelChangeName, d);
        this.nameSignal(value);
    }
}