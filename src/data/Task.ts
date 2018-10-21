import S from "s-js";
import SArray from "s-array";
import { ITask, ILabel, IDateTime } from "../interfaces";
import { DateTime } from "./DateTime";


export class Task implements ITask {

    static counter = 0;

    addLabelAssociation(label: ILabel): void {
        this.assignedLabels.push(label);
    }


    removeLabelAssociation(label: ILabel): void {
        this.assignedLabels.remove(label);
    }


    title = S.data("");
    assignedLabels = SArray<ILabel>([]);
    id = ++Task.counter;
    createdOn = new DateTime("2018");
    completedOn = S.data<IDateTime | undefined>(undefined);


    completedValue(): string {
        const con = this.completedOn();
        return con ? con.value : "";
    }
}