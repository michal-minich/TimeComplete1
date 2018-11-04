import SArray, { SDataArray } from "s-array";
import { ITaskList, ITask } from "../interfaces";
import { Common } from "../common";


export default class TaskList implements ITaskList {
    
    constructor(tasks: ITask[]) {
        this.items = SArray(tasks);
    }


    readonly items: SDataArray<ITask>;


    addTask(task: ITask): void {
        this.items.unshift(task);
    }


    byId(id: number): ITask {
        return Common.findById(this.items, id);
    }
}