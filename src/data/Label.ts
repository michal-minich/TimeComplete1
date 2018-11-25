import { ILabel, IColorStyle as ILabelStyle, ValueSignal, IApp, IDateTime } from "../interfaces";
import { R } from "../common";


export default class Label implements ILabel {

    constructor(
        private readonly app: IApp,
        name: string,
        readonly style: ILabelStyle,
        id?: number,
        createdOn?: IDateTime) {

        this.nameSignal = R.data(name);
        this.style = style;
        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.idCounter.getNext();
            this.createdOn = this.app.clock.now();
        }
        //this.associatedLabels = R.array();
    }


    private readonly nameSignal: ValueSignal<string>;


    id: number;
    createdOn: IDateTime;
    //readonly associatedLabels: WritableArraySignal<ILabel>;


    get name(): string { return this.nameSignal(); }

    set name(value: string) { this.nameSignal(value); }
}