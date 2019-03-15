import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { R } from "../../common";
import { ITask, IApp, ITaskTitleEditUc } from "../../interfaces";


export let taskEditTextBox: HTMLTextAreaElement;


export default class TaskTitleEditUc implements ITaskTitleEditUc {

    constructor(private readonly app: IApp) {
    }

    private newName = R.data("");
    private task!: ITask;


    public begin(t: ITask, titleTd: HTMLTableDataCellElement): void {
        this.task = t;
        this.app.data.selectedTask = t;
        this.newName(t.title);
        const r = titleTd.getBoundingClientRect();
        const p = titleTd.parentElement!.parentElement!
            .parentElement!.parentElement!.parentElement!.parentElement!;
        const pr = p.getBoundingClientRect();
        const txtStyle = taskEditTextBox.style;
        txtStyle.left = (p.offsetLeft + r.left - pr.left) + "px";
        txtStyle.top = (p.offsetTop + r.top - pr.top + titleTd.offsetHeight - 22) + "px";
        txtStyle.width = (titleTd.offsetWidth) + "px";
        txtStyle.height = (titleTd.offsetHeight - 2) + "px";
        txtStyle.visibility = "visible";
        taskEditTextBox.value = t.title;
        setTimeout(() => taskEditTextBox.focus(), 0);
    }


    private confirm: () => void = () => {
        if (this.newName().trim() === "") {
            this.cancel();
        } else {
            this.task.title = this.newName();
            this.cleanup();
        }
    }


    private cancel(): void {
        this.cleanup();
    }


    private cleanup(): void {
        taskEditTextBox.style.visibility = "hidden";
        this.newName("");
    }


    private keyUp : (e: KeyboardEvent) => void = (e) => {
        if (e.key === "Enter") {
            confirm();
            e.preventDefault();
        } else if (e.key === "Escape") {
            this.cancel();
        }
    }


    public readonly view =
        <textarea
            ref={taskEditTextBox}
            fn={data(this.newName)}
            onKeyUp={(e: KeyboardEvent) => this.keyUp(e)}
            onBlur={() => confirm()}
            className="task-text-edit-box selected-task">
        </textarea>;
}