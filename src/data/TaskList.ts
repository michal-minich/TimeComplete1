import SArray from "s-array";
import { ITaskList, ITask, WArray, RArray } from "../interfaces";
import { Common } from "../common";


export default class TaskList implements ITaskList {

    constructor(tasks: ITask[]) {
        this.itemsSignal = SArray(tasks);
    }


    private readonly itemsSignal: WArray<ITask>;


    get items(): RArray<ITask> {
        return this.itemsSignal;
    }


    addTask(task: ITask): void {
        this.itemsSignal.unshift(task);
    }


    byId(id: number): ITask {
        return Common.findById(this.itemsSignal, id);
    }
}