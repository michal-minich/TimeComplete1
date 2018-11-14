import S, { DataSignal } from "s-js";
import SArray, { SDataArray } from "s-array";
import App from "../controllers/App";
import { ITask, ILabel, IDateTime, IAssociatedLabels } from "../interfaces";
import { findById } from "../common";


export default class Task implements ITask {

    constructor(title: string, associatedLabels?: AssociatedLabels) {
        this.titleSignal = S.data(title);
        this.associatedLabels = associatedLabels
            ? associatedLabels
            : new AssociatedLabels([]);
    }


    private readonly titleSignal: DataSignal<string>;
    private readonly completedOnSignal = S.data<IDateTime | undefined>(undefined);


    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();


    readonly associatedLabels: AssociatedLabels;


    get title(): string { return this.titleSignal(); }

    set title(value: string) { this.titleSignal(value); }


    get completedOn(): IDateTime | undefined { return this.completedOnSignal(); }

    set completedOn(value: IDateTime | undefined) { this.completedOnSignal(value); }
}


export class AssociatedLabels implements IAssociatedLabels {

    constructor(labels: ILabel[]) {
        this.items = SArray(labels);
    }


    readonly items: SDataArray<ILabel>;


    add(label: ILabel): void { this.items.push(label); }

    remove(label: ILabel): void { this.items.remove(label); }


    byId(id: number): ILabel {
        return findById(this.items, id);
    }
}