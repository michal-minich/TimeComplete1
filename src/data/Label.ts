import S, { DataSignal } from "s-js";
import { clock, idCounter } from "../common";
import { ILabel, IColor } from "../interfaces";


export class Label implements ILabel {

    id = idCounter.getNext();
    createdOn = clock.now();

    name: DataSignal<string>;
    color: DataSignal<IColor>;
    parent?: DataSignal<ILabel>;


    constructor(name: string, color: IColor) {
        this.name = S.data(name);
        this.color = S.data(color);
    }
}