import S from "s-js";
import { IApp, ITask, ITaskListActivity, IEditTaskTitleActivity } from "../interfaces";
import * as V from "../views";


export class EditTaskTitleActivity implements IEditTaskTitleActivity {

    newTitle = S.data("");
    private originalTitle = "";
    private readonly app: IApp;

    constructor(app: IApp) {
        this.app = app;
    }


    begin(t: ITask, titleTd: HTMLTableDataCellElement, tla: ITaskListActivity): void {
        this.originalTitle = t.title();
        this.app.selectTaskActivity.select(t);
        this.newTitle(t.title());
        V.AppView.taskEditTextBox.value = t.title();
        const r = titleTd.getBoundingClientRect();
        const txtStyle = V.AppView.taskEditTextBox.style;
        txtStyle.left = r.left + "px";
        txtStyle.top = r.top + "px";
        txtStyle.width = r.width + "px";
        txtStyle.height = (r.height - 1) + "px";
        txtStyle.display = "block";
        setTimeout(() => V.AppView.taskEditTextBox.focus(), 0);
    }


    commit(): void {
        if (this.newTitle().trim() === "") {
            this.rollback();
        } else {
            this.app.selectTaskActivity.selectedTask()!.title(this.newTitle());
            this.cleanup();
        }
    }


    rollback(): void {
        this.cleanup();
    }


    cleanup(): void {
        V.AppView.taskEditTextBox.style.display = "none";
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}