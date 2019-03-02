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

    constructor(
        private readonly app: IApp,
        name: string,
        readonly style: IColorStyle,
        public version: number,
        readonly id: number,
        readonly createdOn: IDateTime) {

        this.nameSignal = R.data(name);
        style.owner = this;
    }


    static createNew(app: IApp, name: string, style: IColorStyle): ILabel {
        const l = new Label(app, name, style, 1, app.data.getNextId(), app.clock.now());
        return l;
    }

    
    private readonly nameSignal: ValueSignal<string>;


    readonly type = "label";


    get name(): string { return this.nameSignal(); }

    set name(value: string) {
        if (this.nameSignal() === value)
            return;
        this.nameSignal(value);
        this.app.sync.pushField("label.name", this, value);
    }
}