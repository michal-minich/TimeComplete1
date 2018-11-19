import DateTime from "../data/DateTime";
import { IApp, IChangeTaskCompletionActivity, ITask } from "../interfaces";


export default class ChangeTaskCompletionActivity implements IChangeTaskCompletionActivity {

    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    perform(task: ITask, isDone: HTMLInputElement): any {
        if (isDone.checked) {
            task.completedOn = new DateTime("2019");
        } else {
            task.completedOn = undefined;
        }
    }
}