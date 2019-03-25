import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { R } from "../../common";
import { ITask, IApp, ITaskTitleEditUc, ValueSignal } from "../../interfaces";


export let taskEditTextBox: HTMLTextAreaElement;


export default class TaskTitleEditUc implements ITaskTitleEditUc {


    private newName = R.data("");
    task!: ITask;


    constructor(private readonly app: IApp) {

        this.view = getControlledView(this.newName, this);
    }

    view: HTMLElement;


    begin(t: ITask, titleTd: HTMLTableDataCellElement): void {
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

}


function getControlledView(
    newName: ValueSignal<string>,
    owner: TaskTitleEditUc): HTMLElement {


    function confirm(): void {
        if (newName().trim() === "") {
            cancel();
        } else {
            owner.task.title = newName();
            cleanup();
        }
    }


    function cancel(): void {
        cleanup();
    }


    function cleanup(): void {
        taskEditTextBox.style.visibility = "hidden";
        newName("");
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            confirm();
            e.preventDefault();
        } else if (e.key === "Escape") {
            cancel();
        }
    }


    const view =
        <textarea
            ref={taskEditTextBox}
            fn={data(newName)}
            onKeyUp={(e: KeyboardEvent) => keyUp(e)}
            onBlur={() => confirm()}
            className="task-text-edit-box selected-task">
        </textarea>;

    return view;
}