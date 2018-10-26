import S from "s-js";
import { IApp, ITask, IEditTaskTitleActivity } from "../interfaces";
import { AppView } from "../views";


export class EditTaskTitleActivity implements IEditTaskTitleActivity {

    newTitle = S.data("");
    private readonly app: IApp;
    private task!: ITask;


    constructor(app: IApp) {
        this.app = app;
    }


    begin(t: ITask, titleTd: HTMLTableDataCellElement): void {
        this.task = t;
        this.app.activity.selectTask.select(t);
        this.newTitle(t.title());
        const r = titleTd.getBoundingClientRect();
        const p = titleTd.parentElement!.parentElement!
            .parentElement!.parentElement!.parentElement!;
        const pr = p.getBoundingClientRect();
        const txtStyle = AppView.taskEditTextBox.style;
        txtStyle.left = (p.offsetLeft + r.left - pr.left - 1) + "px";
        txtStyle.top = (p.offsetTop + r.top - pr.top + 29) + "px";
        txtStyle.width = (titleTd.offsetWidth) + "px";
        txtStyle.height = (titleTd.offsetHeight - 2) + "px";
        txtStyle.display = "block";
        AppView.taskEditTextBox.value = t.title();
        setTimeout(() => AppView.taskEditTextBox.focus(), 0);
    }


    commit(): void {
        if (this.newTitle().trim() === "") {
            this.rollback();
        } else {
            this.task.title(this.newTitle());
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