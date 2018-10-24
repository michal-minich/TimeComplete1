import S, { DataSignal } from "s-js";
import { App } from "../controllers/App";
import { ILabel, IColor } from "../interfaces";


export class Label implements ILabel {

    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();

    name: DataSignal<string>;
    color: DataSignal<IColor>;
    parent?: DataSignal<ILabel>;


    constructor(name: string, color: IColor) {
        this.name = S.data(name);
        this.color = S.data(color);
    }
}