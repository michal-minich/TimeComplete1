import SArray, { SDataArray } from "s-array";
import { ILabelList, ILabel } from "../interfaces";
import { Common } from "../common";


export default class LabelList implements ILabelList {
    
    constructor(labels: ILabel[]) {
        this.items = SArray(labels);
    }


    readonly items: SDataArray<ILabel>; // todo make SArray only for public


    addLabel(label: ILabel): void {
        this.items.unshift(label);
    }


    removeLabel(label: ILabel): void {
        this.items.remove(label);
    }


    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }
}