import S from "s-js";
import Task from "../data/Task";
import { IApp, IAddTaskActivity } from "../interfaces";


export class AddTaskActivity implements IAddTaskActivity {

    readonly newTitle = S.data("");
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }

    /*
    get newTitle(): string {
        return this.newTitleSignal();
    }



    set newTitle(value: string) {
        this.newTitleSignal(value);
        // todo save
    }
    */

    commit(): void {
        if (this.newTitle() === "")
            return;
        const t = new Task(this.newTitle());
        this.newTitle("");
        this.app.data.tasks.addTask(t);
    }


    rollback(): void {
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}