import SArray from "s-array";
import { ILabelList, ILabel, WArray, RArray } from "../interfaces";
import { Common } from "../common";


export default class LabelList implements ILabelList {

    constructor(labels: ILabel[]) {
        this.itemsSignal = SArray(labels);
    }


    private readonly itemsSignal: WArray<ILabel>;


    get items(): RArray<ILabel> {
        return this.itemsSignal;
    }


    addLabel(label: ILabel): void {
        this.itemsSignal.unshift(label);
    }


    removeLabel(label: ILabel): void {
        this.itemsSignal.remove(label);
    }


    byId(id: number): ILabel {
        return Common.findById(this.itemsSignal, id);
    }
}