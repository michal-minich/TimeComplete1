import SArray, { SDataArray } from "s-array";
import { ITaskList, ITask } from "../interfaces";


export class TaskList implements ITaskList {

    readonly tasks: SDataArray<ITask> = SArray([]);


    addTask(task: ITask): void {
        this.tasks.unshift(task);
    }
}