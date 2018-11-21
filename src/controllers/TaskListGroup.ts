import { IApp, ITaskListGroup, ITaskListActivity, WritableArraySignal } from "../interfaces";
import TaskListActivity from "./TaskListActivity";
import { R } from "../common";


export default class TaskListGroup implements ITaskListGroup {

    items: WritableArraySignal<ITaskListActivity>;
    private readonly app: IApp;


    constructor(app: IApp, items: ITaskListActivity[]) {
        this.app = app;
        this.items = R.array(items);
    }


    add(tla: ITaskListActivity): void {
        this.items.push(tla);
    }


    addNew(): void {
        this.items.push(new TaskListActivity(this.app));
    }


    remove(tla: ITaskListActivity): void {
        this.items.remove(tla);
    }
}