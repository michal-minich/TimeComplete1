import S, { DataSignal } from "s-js";
import SArray, { SDataArray } from "s-array";
import App from "../controllers/App";
import { ITask, ILabel, IDateTime, IAssociatedLabels } from "../interfaces";
import { Common } from "../common";
import Serializer from "../operations/Serializer";


export default class Task implements ITask {

    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();

    private readonly titleSignal: DataSignal<string>;
    readonly associatedLabels: AssociatedLabels;
    private readonly completedOnSignal = S.data<IDateTime | undefined>(undefined);


    get title(): string {
        return this.titleSignal();
    }


    set title(value: string) {
        this.titleSignal(value);
    }


    get completedOn(): IDateTime | undefined {
        return this.completedOnSignal();
    }


    set completedOn(value: IDateTime | undefined) {
        this.completedOnSignal(value);
    }


    constructor(title: string, associatedLabels?: AssociatedLabels) {
        this.titleSignal = S.data(title);
        this.associatedLabels = associatedLabels
            ? associatedLabels
            : new AssociatedLabels([]);
    }
}


export class AssociatedLabels implements IAssociatedLabels {

    readonly items: SDataArray<ILabel>;


    constructor(labels: ILabel[]) {
        this.items = SArray(labels);
    }


    add(label: ILabel): void {
        this.items.push(label);
        this.save();
    }


    remove(label: ILabel): void {
        this.items.remove(label);
        this.save();
    }


    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }


    private save(): void {
        if (App.instance.data.tasks)
            this.saveWithSerialize("tasks", App.instance.data.tasks.items());
    }


    private saveWithSerialize<T extends object>(key: string, value: T): void {
        const sv = new Serializer().toPlainObject(value);
        App.instance.localStore.save(key, sv);
    }
}