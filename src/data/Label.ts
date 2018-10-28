import S, { DataSignal } from "s-js";
import App from "../controllers/App";
import { ILabel, IColor } from "../interfaces";


export default class Label implements ILabel {

    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();

    private readonly nameSignal: DataSignal<string>;
    private readonly colorSignal: DataSignal<IColor>;
    private readonly parentSignal: DataSignal<ILabel | undefined> = S.data(undefined);


    get name(): string {
        return this.nameSignal();
    }


    set name(value: string) {
        this.nameSignal(value);
        // todo save
    }


    get color(): IColor {
        return this.colorSignal();
    }


    set color(value: IColor) {
        this.colorSignal(value);
        // todo save
    }


    get parent(): ILabel | undefined {
        return this.parentSignal();
    }


    set parent(value: ILabel | undefined) {
        this.parentSignal(value);
        // todo save
    }


    constructor(name: string, color: IColor) {
        this.nameSignal = S.data(name);
        this.colorSignal = S.data(color);
    }
}