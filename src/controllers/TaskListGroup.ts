import SArray, { SDataArray } from "s-array";
import { IApp, ITaskListGroup, ITaskListActivity } from "../interfaces";
import TaskListActivity from "./TaskListActivity";


export default class TaskListGroup implements ITaskListGroup {

    items: SDataArray<ITaskListActivity>;
    private readonly app: IApp;


    constructor(app: IApp, items: ITaskListActivity[]) {
        this.app = app;
        this.items = SArray(items);
    }


    add(tla: ITaskListActivity): void {
        this.items.push(tla);
    }


    addNew(): void {
        this.items.push(new TaskListActivity(this.app));
        this.app.activity.save();
    }


    remove(tla: ITaskListActivity): void {
        this.items.remove(tla);
        this.app.activity.save();
    }
}