import {
        ILabel,
        IColorStyle,
        ValueSignal,
        IApp,
        IDateTime,
    } from
    "../../interfaces";
import { R } from "../../common";


export default class Label implements ILabel {

    private constructor(
        private readonly app: IApp,
        name: string,
        readonly style: IColorStyle,
        public version: number,
        id: number,
        createdOn: IDateTime) {

        this.nameSignal = R.data(name);
        style.owner = this;
        this.style = style;
        this.id = id;
        this.createdOn = createdOn;
    }


    static createNew(app: IApp, name: string, style: IColorStyle): ILabel {
        const l = new Label(app, name, style, 1, app.data.getNextId(), app.clock.now());
        return l;
    }


    static createFromStore(app: IApp,
        name: string,
        style: IColorStyle,
        version: number,
        id: number,
        createdOn: IDateTime): ILabel {

        return new Label(app, name, style, version, id, createdOn);
    }


    private readonly nameSignal: ValueSignal<string>;


    readonly type = "label";
    id: number;
    createdOn: IDateTime;


    get name(): string { return this.nameSignal(); }

    set name(value: string) {
        if (this.nameSignal() === value)
            return;
        this.nameSignal(value);
        this.app.sync.pushField("label.name", this, value);
    }
}