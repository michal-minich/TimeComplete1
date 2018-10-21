import S from "s-js";
import { IApp, ISelectTaskActivity, ITask } from "../interfaces";


export class SelectTaskActivity implements ISelectTaskActivity {

    private readonly app: IApp;
    selectedTask = S.data(undefined as (ITask | undefined));


    constructor(app: IApp) {
        this.app = app;
    }


    select(t: ITask): void {
        this.selectedTask(t);
    }


    unselect(): void {
        this.selectedTask(undefined);
    }
}