import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ITasksDashItem, ITask, ITaskAddUc } from "../../interfaces";
import Task from "../../data/domain/Task";
import Query from "../../data/Query";


export default class TaskAddUc implements ITaskAddUc {

    constructor(app: IApp, tdi: ITasksDashItem) {

        this.view = getControlledView(app, tdi);
    }

    readonly view: HTMLElement;
}


function getControlledView(app: IApp, tdi: ITasksDashItem) {


    function confirm(queryText: string): void {
        if (tdi.newTitle() === "")
            return;
        let title = tdi.newTitle();
        tdi.newTitle("");
        const sq = new Query(app, queryText);
        const tq = new Query(app, title);
        for (const l of tq.matcher.existingLabels) {
            title = title.replace("#" + l.name, "");
        }
        title = title.trim().replace("  ", " ");
        const t = new Task(app, title, 1);
        associateLabels(t, sq.matcher.existingLabels);
        associateLabels(t, tq.matcher.existingLabels);
        app.data.taskAdd(t);
    }


    function associateLabels(t: ITask, ls: ILabel[]) {
        for (const l of ls) {
            t.addLabel(l);
        }
    }


    function cancel(): void {
        tdi.newTitle("");
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Enter")
            confirm(tdi.query.text());
        else if (e.key === "Escape")
            cancel();
    }


    const view =
        <input type="text"
               placeholder="add new task"
               className="new-task-input"
               onKeyUp={keyUp}
               fn={data(tdi.newTitle)}/>;

    return view;
}