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
        console.log("begin: " + t.title() + ", original: " + this.originalTitle);
        this.originalTitle = t.title();
        this.app.activity.selectTask.select(t);
        this.newTitle(t.title());
        AppView.taskEditTextBox.value = t.title();
        const r = titleTd.getBoundingClientRect();
        const p = titleTd.parentElement!.parentElement!
            .parentElement!.parentElement!.parentElement!;
        const pr = p.getBoundingClientRect();
        const relLeft = (r.left - pr.left);
        const relTop = (r.top - pr.top);
        const txtStyle = AppView.taskEditTextBox.style;
        txtStyle.left = (p.offsetLeft + relLeft) + "px";
        txtStyle.top = (p.offsetTop+ relTop + 30) + "px";
        txtStyle.width = (titleTd.offsetWidth) + "px";
        txtStyle.height = (titleTd.offsetHeight - 2) + "px";
        txtStyle.display = "block";
        setTimeout(() => AppView.taskEditTextBox.focus(), 0);
    }


    commit(): void {
        console.log("commit: " + this.originalTitle);
        if (this.newTitle().trim() === "") {
            this.rollback();
        } else {
            this.app.activity.selectTask.selectedTask()!.title(this.newTitle());
            this.cleanup();
        }
    }


    rollback(): void {
        console.log("rollback: " + this.originalTitle);
        this.cleanup();
    }


    cleanup(): void {
        console.log("cleanup: " + this.originalTitle);
        AppView.taskEditTextBox.style.display = "none";
        this.originalTitle = "";
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        console.log("keyUp: " + this.originalTitle);
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}