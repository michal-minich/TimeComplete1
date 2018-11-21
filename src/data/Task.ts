import { ITask, IDateTime, ILabel, IApp, ValueSignal, WritableArraySignal, ILabel as ILabel1 } from "../interfaces";
import { R } from "../common";


export default class Task implements ITask {

    constructor(
        private readonly app: IApp,
        title: string,
        associatedLabels?: WritableArraySignal<ILabel>) {

        this.titleSignal = R.data(title);
        this.associatedLabels = associatedLabels ? associatedLabels : R.array([]);
    }


    private readonly titleSignal: ValueSignal<string>;
    private readonly completedOnSignal = R.data<IDateTime | undefined>(undefined);


    id = this.app.idCounter.getNext();
    createdOn = this.app.clock.now();
    readonly associatedLabels: WritableArraySignal<ILabel1>;


    get title(): string { return this.titleSignal(); }

    set title(value: string) { this.titleSignal(value); }


    get completedOn(): IDateTime | undefined { return this.completedOnSignal(); }

    set completedOn(value: IDateTime | undefined) { this.completedOnSignal(value); }
}