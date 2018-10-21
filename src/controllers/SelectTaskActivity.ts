import S from "s-js";
import * as I from "../interfaces";


export class SelectTaskActivity implements I.ISelectTaskActivity {
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }

    selectedTask = S.data(undefined as (I.ITask | undefined));


    select(t: I.ITask): void {
        this.selectedTask(t);
    }

    unselect(): void {
        this.selectedTask(undefined);
    }

}