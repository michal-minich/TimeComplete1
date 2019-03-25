import {
    ITask,
    IDateTime,
    ILabel,
    IApp,
    ValueSignal,
    WritableArraySignal,
    IDateTime as IDateTime1,
    ArraySignal
} from "../../interfaces";
import { R } from "../../common";


export default class Task implements ITask {

    constructor(
        private readonly app: IApp,
        title: string,
        text: string,
        public version: number,
        labelsFromUser: WritableArraySignal<ILabel> | undefined,
        completedOn: IDateTime | undefined,
        id: number,
        createdOn: IDateTime) {

        this.titleSignal = R.data(title);
        this.textSignal = R.data(text);
        this.labelsFromUser = labelsFromUser ? labelsFromUser : R.array([]);
        this.labelsFromTextSignal = R.array();
        this.completedOnSignal = R.data(completedOn);
        this.id = id;
        this.createdOn = createdOn;
    }


    static createNew(
        app: IApp,
        title: string,
        text: string,
        associatedLabels?: WritableArraySignal<ILabel>,
        completedOn?: IDateTime1): ITask {

        const t = new Task(
            app,
            title,
            text,
            1,
            associatedLabels,
            completedOn,
            app.data.getNextId(),
            app.clock.now());
        return t;
    }


    readonly titleSignal: ValueSignal<string>;
    readonly completedOnSignal: ValueSignal<IDateTime | undefined>;
    labelsFromUser: WritableArraySignal<ILabel>;
    labelsFromTextSignal: WritableArraySignal<ILabel>;
    readonly textSignal: ValueSignal<string>;


    readonly type: "task" = "task";
    id: number;
    createdOn: IDateTime;


    get title(): string { return this.titleSignal(); }

    set title(value: string) {
        if (this.titleSignal() === value)
            return;
        this.titleSignal(value);
        this.app.sync.pushField("task.title", this, value);
    }


    get completedOn(): IDateTime | undefined { return this.completedOnSignal(); }

    set completedOn(value: IDateTime | undefined) {
        const cur = this.completedOnSignal();
        const val = value === undefined ? undefined : value.value;
        // ReSharper disable once QualifiedExpressionMaybeNull
        if ((cur === undefined ? undefined : cur.value) === val)
            return;
        this.completedOnSignal(value);
        this.app.sync.pushField("task.completedOn", this, val);
    }

    addLabel(l: ILabel): void {
        this.labelsFromUser.push(l);
        this.app.sync.pushField("task.labelsFromUser.add", this, l.id);
    }

    removeLabel(l: ILabel): void {
        this.labelsFromUser.remove(l);
        this.app.sync.pushField("task.labelsFromUser.remove", this, l.id);
    }


    get labelsFromText(): ArraySignal<ILabel> {
        return this.labelsFromTextSignal;
    }


    get associatedLabels(): ArraySignal<ILabel> {
        return this.labelsFromText.concat(this.labelsFromUser);
    }


    get text(): string { return this.textSignal(); }

    set text(value: string) {
        if (this.textSignal() === value)
            return;
        this.textSignal(value);
        this.app.sync.pushField("task.text", this, value);
    }
}