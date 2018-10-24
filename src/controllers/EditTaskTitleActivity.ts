import S from "s-js";
import { IApp, ITask, ITaskListActivity, IEditTaskTitleActivity } from "../interfaces";
import { AppView } from "../views";


export class EditTaskTitleActivity implements IEditTaskTitleActivity {

    newTitle = S.data("");
    private originalTitle = "";
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    begin(t: ITask, titleTd: HTMLTableDataCellElement): void {
        this.originalTitle = t.title();
        this.app.activity.selectTask.select(t);
        this.newTitle(t.title());
        AppView.taskEditTextBox.value = t.title();
        const r = titleTd.getBoundingClientRect();
        const txtStyle = AppView.taskEditTextBox.style;
        txtStyle.left = r.left + "px";
        txtStyle.top = r.top + "px";
        txtStyle.width = r.width + "px";
        txtStyle.height = (r.height - 1) + "px";
        txtStyle.display = "block";
        setTimeout(() => AppView.taskEditTextBox.focus(), 0);
    }


    commit(): void {
        if (this.newTitle().trim() === "") {
            this.rollback();
        } else {
            this.app.activity.selectTask.selectedTask()!.title(this.newTitle());
            this.cleanup();
        }
    }


    rollback(): void {
        this.cleanup();
    }


    cleanup(): void {
        AppView.taskEditTextBox.style.display = "none";
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}