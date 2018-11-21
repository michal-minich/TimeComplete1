import { INote, ValueSignal, ILabel, ArraySignal, IApp, WritableArraySignal } from "../interfaces";
import { R } from "../common";


export default class Note implements INote {

    constructor(private readonly app: IApp) {
        this.textSignal = R.data("");
        this.associatedLabels = R.array([]);
    }


    id = this.app.idCounter.getNext();
    createdOn = this.app.clock.now();
    readonly associatedLabels: WritableArraySignal<ILabel>;
    private readonly textSignal: ValueSignal<string>;


    get labelsFromText(): ArraySignal<ILabel> {
        throw undefined;
    }


    get allLabels(): ArraySignal<ILabel> {
        return this.labelsFromText.concat(this.associatedLabels);
    }


    get text(): string { return this.textSignal(); }

    set text(value: string) { this.textSignal(value); }
}