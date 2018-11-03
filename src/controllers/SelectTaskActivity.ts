import S from "s-js";
import { IApp, ISelectTaskActivity, ITask } from "../interfaces";


export default class SelectTaskActivity implements ISelectTaskActivity {

    private readonly app: IApp;
    private selectedTaskSignal = S.data(undefined as (ITask | undefined));


    constructor(app: IApp) {
        this.app = app;
    }


    get selectedTask(): ITask | undefined {
        return this.selectedTaskSignal();
    }


    set selectedTask(value: ITask | undefined) {
        this.selectedTaskSignal(value);
        this.app.activity.save();
    }
}