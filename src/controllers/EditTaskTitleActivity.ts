import S from "s-js";
import { IApp, ITask, IEditTaskTitleActivity } from "../interfaces";
import { taskEditTextBox } from "../views/MainView";


export default class EditTaskTitleActivity implements IEditTaskTitleActivity {

    newName = S.data("");
    private readonly app: IApp;
    private task!: ITask;


    constructor(app: IApp) {
        this.app = app;
    }


    begin(t: ITask, titleTd: HTMLTableDataCellElement): void {
        this.task = t;
        this.app.activity.selectTask.selectedTask = t;
        this.newName(t.title);
        const r = titleTd.getBoundingClientRect();
        const p = titleTd.parentElement!.parentElement!
            .parentElement!.parentElement!.parentElement!.parentElement!;
        const pr = p.getBoundingClientRect();
        const txtStyle = taskEditTextBox.style;
        txtStyle.left = (p.offsetLeft + r.left - pr.left + 1) + "px";
        txtStyle.top = (p.offsetTop + r.top - pr.top + titleTd.offsetHeight - 20) + "px";
        txtStyle.width = (titleTd.offsetWidth) + "px";
        txtStyle.height = (titleTd.offsetHeight - 2) + "px";
        txtStyle.visibility = "visible";
        taskEditTextBox.value = t.title;
        setTimeout(() => taskEditTextBox.focus(), 0);
    }


    commit(): void {
        if (this.newName().trim() === "") {
            this.rollback();
        } else {
            this.task.title = this.newName();
            this.cleanup();
        }
    }


    rollback(): void {
        this.cleanup();
    }


    cleanup(): void {
        taskEditTextBox.style.visibility = "hidden";
        this.newName("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13) {
            this.commit();
            e.preventDefault();
        } else if (e.keyCode === 27) {
            this.rollback();
        }
    }
}