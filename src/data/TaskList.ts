import SArray, { SArray as SArrayType, SDataArray } from "s-array";
import { ITaskList, ITask } from "../interfaces";
import { TaskQueryParser } from "../operations/query";


export class TaskList implements ITaskList {

    searchedTasks(taskQuery: string): SArrayType<ITask> {
        new String("").padStart(1, "");
        const q = new TaskQueryParser().parse(taskQuery);
        return this.tasks.filter(t => q.taskMatches(t));
    }


    addTask(task: ITask): void {
        this.tasks.unshift(task);
    }


    tasks: SDataArray<ITask> = SArray([]);
}