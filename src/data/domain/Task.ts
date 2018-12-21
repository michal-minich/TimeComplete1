import {
    ITask,
    IDateTime,
    ILabel,
    IApp,
    ValueSignal,
    WritableArraySignal
} from "../../interfaces";
import { R } from "../../common";


export default class Task implements ITask {

    constructor(
        private readonly app: IApp,
        title: string,
        public version: number,
        associatedLabels?: WritableArraySignal<ILabel>,
        completedOn?: IDateTime,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        this.associatedLabels = associatedLabels ? associatedLabels : R.array([]);
        this.completedOnSignal = R.data(completedOn);

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.getNextId();
            this.createdOn = this.app.clock.now();
        }
    }


    private readonly titleSignal: ValueSignal<string>;
    readonly completedOnSignal: ValueSignal<IDateTime | undefined>;


    readonly type = "task";
    id: number;
    createdOn: IDateTime;
    readonly associatedLabels: WritableArraySignal<ILabel>;


    get title(): string { return this.titleSignal(); }

    set title(value: string) {
        if (this.titleSignal() === value)
            return;
        this.titleSignal(value);
        this.app.data.sync.pushField("task.title", this, value);
    }


    get completedOn(): IDateTime | undefined { return this.completedOnSignal(); }

    set completedOn(value: IDateTime | undefined) {
        const cur = this.completedOnSignal();
        const val = value === undefined ? undefined : value.value;
        // ReSharper disable once QualifiedExpressionMaybeNull
        if ((cur === undefined ? undefined : cur.value) === val)
            return;
        this.completedOnSignal(value);
        this.app.data.sync.pushField("task.completedOn", this, val);
    }

    addLabel(l: ILabel): void {
        this.associatedLabels.push(l);
        this.app.data.sync.pushField("task.associatedLabels.add", this, l.id);
    }

    removeLabel(l: ILabel): void {
        this.associatedLabels.remove(l);
        this.app.data.sync.pushField("task.associatedLabels.remove", this, l.id);
    }
}