import { ILabel, ILabelStyle, ValueSignal, IApp } from "../interfaces";
import { R } from "../common";


export default class Label implements ILabel {

    constructor(
        private readonly app: IApp,
        name: string,
        readonly style: ILabelStyle) {

        this.nameSignal = R.data(name);
        this.style = style;
        //this.associatedLabels = R.array();
    }


    private readonly nameSignal: ValueSignal<string>;


    id = this.app.idCounter.getNext();
    createdOn = this.app.clock.now();
    //readonly associatedLabels: WritableArraySignal<ILabel>;


    get name(): string { return this.nameSignal(); }

    set name(value: string) { this.nameSignal(value); }
}