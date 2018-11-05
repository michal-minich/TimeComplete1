import S, { DataSignal } from "s-js";
import App from "../controllers/App";
import { ILabel, ILabelStyle } from "../interfaces";


export default class Label implements ILabel {

    constructor(name: string, style: ILabelStyle) {
        this.nameSignal = S.data(name);
        this.style = style;
        this.parentSignal = S.data(undefined);
    }


    private readonly nameSignal: DataSignal<string>;
    private readonly parentSignal: DataSignal<ILabel | undefined>;


    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();


    readonly style: ILabelStyle;


    get name(): string { return this.nameSignal(); }

    set name(value: string) { this.nameSignal(value); }


    get parent(): ILabel | undefined { return this.parentSignal(); }

    set parent(value: ILabel | undefined) { this.parentSignal(value); }
}