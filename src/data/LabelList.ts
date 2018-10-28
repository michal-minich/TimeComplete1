import SArray, { SDataArray } from "s-array";
import App from "../controllers/App";
import { ILabelList, ILabel } from "../interfaces";
import Serializer from "../operations/Serializer";
import { Common } from "../common";


export default class LabelList implements ILabelList {

    readonly items: SDataArray<ILabel>;


    constructor(labels: ILabel[]) {
        this.items = SArray(labels);
    }


    addLabel(label: ILabel): void {
        this.items.unshift(label);
        this.save();
    }


    removeLabel(label: ILabel): void {
        this.items.remove(label);
        this.save();
    }


    private save(): void {
        this.saveWithSerialize("labels", this.items());
    }


    private saveWithSerialize<T extends object>(key: string, value: T): void {
        const sv = new Serializer().toPlainObject(value);
        App.instance.sessionStore.save(key, sv);
    }


    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }
}