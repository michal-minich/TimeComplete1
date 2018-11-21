import { IApp, ISelectTaskActivity, ITask } from "../interfaces";
import { R } from "../common";


export default class SelectTaskActivity implements ISelectTaskActivity {


    private selectedTaskSignal = R.data(undefined as (ITask | undefined));


    constructor(private readonly app: IApp) {
    }


    get selectedTask(): ITask | undefined {
        return this.selectedTaskSignal();
    }


    set selectedTask(value: ITask | undefined) {
        this.selectedTaskSignal(value);
    }
}