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
        readonly id: number,
        readonly createdOn: IDateTime) {

        this.titleSignal = R.data(title);
        this.textSignal = R.data(text);
        this.associatedLabels = R.array([]);
    }


    static createNew(app: IApp, title: string, text: string): INote {
        const n = new Note(
            app,
            title,
            text,
            1,
            app.data.getNextId(),
            app.clock.now());
        return n;
    }


    readonly type = "note";
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
        this.app.sync.pushField("note.text", this, value);
    }


    get title(): string { return this.titleSignal(); }

    set title(value: string) {
        if (this.titleSignal() === value)
            return;
        this.titleSignal(value);
        this.app.sync.pushField("note.title", this, value);
    }
}