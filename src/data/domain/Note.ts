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
        title: string,
        text: string,
        public version: number,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        this.textSignal = R.data(text);
        this.associatedLabels = R.array([]);

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.getNextId();
            this.createdOn = this.app.clock.now();
        }
    }


    readonly type = "note";
    id: number;
    createdOn: IDateTime;
    associatedLabels: WritableArraySignal<ILabel>;
    readonly textSignal: ValueSignal<string>;
    readonly titleSignal: ValueSignal<string>;


    get labelsFromText(): ArraySignal<ILabel> {
        throw undefined;
    }


    get allLabels(): ArraySignal<ILabel> {
        return this.labelsFromText.concat(this.associatedLabels);
    }


    get text(): string { return this.textSignal(); }

    set text(value: string) {
        if (this.textSignal() === value)
            return;
        this.textSignal(value);
        this.app.data.sync.pushField("note.text", this, value);
    }


    get title(): string { return this.titleSignal(); }

    set title(value: string) {
        if (this.titleSignal() === value)
            return;
        this.titleSignal(value);
        this.app.data.sync.pushField("note.title", this, value);
    }
}