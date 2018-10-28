import SArray, { SDataArray } from "s-array";
import App from "../controllers/App";
import { ITaskList, ITask } from "../interfaces";
import Serializer from "../operations/Serializer";
import { Common } from "../common";


export default class TaskList implements ITaskList {

    readonly items: SDataArray<ITask> = SArray([]);


    constructor(tasks: ITask[]) {
        this.items = SArray(tasks);
    }


    addTask(task: ITask): void {
        this.items.unshift(task);
        this.save();
    }


    private save(): void {
        this.saveWithSerialize("tasks", this.items());
    }


    private saveWithSerialize<T extends object>(key: string, value: ArrayLike<T>): void {
        const sv = new Serializer().toPlainObject(value);
        App.instance.sessionStore.save(key, sv);
    }


    byId(id: number): ITask {
        return Common.findById(this.items, id);
    }
}