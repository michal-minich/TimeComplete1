import S from "s-js";
import { Task } from "../data/Task";
import { IApp, IAddTaskActivity } from "../interfaces";


export class AddTaskActivity implements IAddTaskActivity {

    newName = S.data("");

    private readonly app: IApp;

    constructor(app: IApp) {
        this.app = app;
    }


    commit(): void {
        if (this.newName() === "")
            return;
        const t = new Task();
        t.title(this.newName());
        this.newName("");
        this.app.taskStore.addTask(t);
    }


    rollback(): void {
        this.newName("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}