import S, { DataSignal } from "s-js";
import App from "../controllers/App";
import { ILabel, IColor } from "../interfaces";


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
    }


    get backColor(): IColor {
        return this.backColorSignal();
    }


    set backColor(value: IColor) {
        this.backColorSignal(value);
    }


    get textColor(): IColor {
        return this.textColorSignal();
    }


    set textColor(value: IColor) {
        this.textColorSignal(value);
    }


    get parent(): ILabel | undefined {
        return this.parentSignal();
    }


    set parent(value: ILabel | undefined) {
        this.parentSignal(value);
    }


    constructor(name: string, backColor: IColor, textColor: IColor) {
        this.nameSignal = S.data(name);
        this.backColorSignal = S.data(backColor);
        this.textColorSignal = S.data(textColor);
    }
}