import SArray, { SDataArray } from "s-array";
import { ITaskList, ITask } from "../interfaces";
import { Common } from "../common";


export default class TaskList implements ITaskList {

    readonly items: SDataArray<ITask>;


    constructor(tasks: ITask[]) {
        this.items = SArray(tasks);
    }


    addTask(task: ITask): void {
        this.items.unshift(task);
        Common.saveWithSerialize("tasks", this.items());
    }


    byId(id: number): ITask {
        return Common.findById(this.items, id);
    }
}