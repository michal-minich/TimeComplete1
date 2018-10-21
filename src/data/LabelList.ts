import SArray, { SDataArray } from "s-array";
import { ILabelList, ILabel } from "../interfaces";


export class LabelList implements ILabelList {
    addLabel(label: ILabel): void {
        this.labels.unshift(label);
    }


    removeLabel(label: ILabel): void {
        this.labels.remove(label);
    }


    labels: SDataArray<ILabel> = SArray([]);
}