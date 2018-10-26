import SArray, { SDataArray } from "s-array";
import { App } from "../controllers/App";
import { ITaskList, ITask } from "../interfaces";
import { SSerializer } from "../operations/Serializer";
import { Common } from "../common";


export class TaskList implements ITaskList {

    readonly items: SDataArray<ITask> = SArray([]);


    addTask(task: ITask): void {
        this.items.unshift(task);
        this.save();
    }


    private save(): void {
        this.saveWithSerialize("tasks", this.items());
    }


    private saveWithSerialize<T extends object>(key: string, value: ArrayLike<T>): void {
        const sv = new SSerializer().toPlainObject(value);
        App.instance.sessionStore.save(key, sv);
    }


    byId(id: number): ITask {
        return Common.findById(this.items, id);
    }
}