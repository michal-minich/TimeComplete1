import S, { DataSignal } from "s-js";
import App from "../controllers/App";
import { ILabel, IColor } from "../interfaces";
import { Common } from "../common";


export default class Label implements ILabel {

    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();

    private readonly nameSignal: DataSignal<string>;
    private readonly backColorSignal: DataSignal<IColor>;
    private readonly textColorSignal: DataSignal<IColor>;
    private readonly parentSignal: DataSignal<ILabel | undefined> = S.data(undefined);


    get name(): string {
        return this.nameSignal();
    }


    set name(value: string) {
        this.nameSignal(value);
        Common.saveWithSerialize("labels", App.instance.data.labels.items());
    }


    get backColor(): IColor {
        return this.backColorSignal();
    }


    set backColor(value: IColor) {
        this.backColorSignal(value);
        Common.saveWithSerialize("labels", App.instance.data.labels.items());
    }


    get textColor(): IColor {
        return this.textColorSignal();
    }


    set textColor(value: IColor) {
        this.textColorSignal(value);
        Common.saveWithSerialize("labels", App.instance.data.labels.items());
    }


    get parent(): ILabel | undefined {
        return this.parentSignal();
    }


    set parent(value: ILabel | undefined) {
        this.parentSignal(value);
        Common.saveWithSerialize("labels", App.instance.data.labels.items());
    }


    constructor(name: string, backColor: IColor, textColor: IColor) {
        this.nameSignal = S.data(name);
        this.backColorSignal = S.data(backColor);
        this.textColorSignal = S.data(textColor);
    }
}