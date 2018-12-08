import {
    INote,
    ValueSignal,
    ILabel,
    ArraySignal,
    IApp,
    WritableArraySignal,
    IDateTime
} from "../../interfaces";
import { R } from "../../common";


export default class Note implements INote {

    constructor(
        private readonly app: IApp,
        id?: number,
        createdOn?: IDateTime) {

        this.textSignal = R.data("");
        this.associatedLabels = R.array([]);

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.idCounter.getNext();
            this.createdOn = this.app.clock.now();
        }
    }


    readonly type = "note";
    id: number;
    createdOn: IDateTime;
    associatedLabels: WritableArraySignal<ILabel>;
    readonly textSignal: ValueSignal<string>;


    get labelsFromText(): ArraySignal<ILabel> {
        throw undefined;
    }


    get allLabels(): ArraySignal<ILabel> {
        return this.labelsFromText.concat(this.associatedLabels);
    }


    get text(): string { return this.textSignal(); }

    set text(value: string) { this.textSignal(value); }
}