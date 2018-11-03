import SArray, { SDataArray } from "s-array";
import { ILabelList, ILabel } from "../interfaces";
import { Common } from "../common";


export default class LabelList implements ILabelList {

    readonly items: SDataArray<ILabel>;


    constructor(labels: ILabel[]) {
        this.items = SArray(labels);
    }


    addLabel(label: ILabel): void {
        this.items.unshift(label);
        Common.saveWithSerialize("labels", this.items());
    }


    removeLabel(label: ILabel): void {
        this.items.remove(label);
        Common.saveWithSerialize("labels", this.items());
    }


    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }
}