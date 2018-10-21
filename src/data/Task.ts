import S, { DataSignal } from "s-js";
import SArray from "s-array";
import { clock, idCounter } from "../common";
import { ITask, ILabel, IDateTime } from "../interfaces";


export class Task implements ITask {

    id = idCounter.getNext();
    createdOn = clock.now();

    title: DataSignal<string>;
    assignedLabels = SArray<ILabel>([]);
    completedOn = S.data<IDateTime | undefined>(undefined);


    constructor(title: string) {
        this.title = S.data(title);
    }


    addLabelAssociation(label: ILabel): void {
        this.assignedLabels.push(label);
    }


    removeLabelAssociation(label: ILabel): void {
        this.assignedLabels.remove(label);
    }
}