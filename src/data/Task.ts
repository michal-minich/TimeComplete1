import S, { DataSignal } from "s-js";
import SArray from "s-array";
import { App } from "../controllers/App";
import { ITask, ILabel, IDateTime, IAssociatedLabels } from "../interfaces";
import { Common } from "../common";


export class Task implements ITask {

    id = App.instance.idCounter.getNext();
    createdOn = App.instance.clock.now();

    title: DataSignal<string>;
    associatedLabels = new AssociatedLabels();
    completedOn = S.data<IDateTime | undefined>(undefined);


    constructor(title: string) {
        this.title = S.data(title);
    }
}


class AssociatedLabels implements IAssociatedLabels {

    items = SArray<ILabel>([]);

    add(label: ILabel): void {
        this.items.push(label);
    }

    remove(label: ILabel): void {
        this.items.remove(label);
    }

    byId(id: number): ILabel {
        return Common.findById(this.items, id);
    }
}