import SArray, { SDataArray } from "s-array";
import { App } from "../controllers/App";
import { ILabelList, ILabel, ITask } from "../interfaces";
import { SSerializer } from "../operations/Serializer";
import { Common } from "../common";


export class LabelList implements ILabelList {

    readonly items: SDataArray<ILabel> = SArray([]);


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
        const sv = new SSerializer().toPlainObject(value);
        App.instance.sessionStore.save(key, sv);
    }


    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }
}