import { ITask, IDateTime, ILabel, IApp, ValueSignal, WritableArraySignal } from "../../interfaces";
import { R } from "../../common";


export default class Task implements ITask {

    constructor(
        private readonly app: IApp,
        title: string,
        associatedLabels?: WritableArraySignal<ILabel>,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        this.associatedLabels = associatedLabels ? associatedLabels : R.array([]);

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.idCounter.getNext();
            this.createdOn = this.app.clock.now();
        }
    }


    private readonly titleSignal: ValueSignal<string>;
    readonly completedOnSignal = R.data<IDateTime | undefined>(undefined);


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
        if ((this.completedOnSignal() === undefined && value === undefined) ||
            (this.completedOnSignal()!.value === value!.value))
            return;
        this.completedOnSignal(value);
        this.app.data.sync.pushField(
            "task.completedOn",
            this,
            value === undefined ? undefined : value.value);
    }

    addLabel(l: ILabel): void {
        this.associatedLabels.push(l);
    }

    removeLabel(l: ILabel): void {
        this.associatedLabels.remove(l);
    }
}