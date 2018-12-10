import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ITasksDashItem, ITask } from "../../interfaces";
import Task from "../../data/domain/Task";
import Query from "../../data/Query";


export default function taskAddView(a: IApp, tdi: ITasksDashItem) {


    function confirm(queryText: string): void {
        if (tdi.newTitle() === "")
            return;
        let title = tdi.newTitle();
        tdi.newTitle("");
        const sq = new Query(a, queryText);
        const tq = new Query(a, title);
        for (const l of tq.matcher.existingLabels) {
            title = title.replace("#" + l.name, "");
        }
        title = title.trim().replace("  ", " ");
        const t = new Task(a, title);
        associateLabels(t, sq.matcher.existingLabels);
        associateLabels(t, tq.matcher.existingLabels);
        a.data.taskAdd(t);
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
               placeholder="new task"
               className="new-task-input"
               onKeyUp={(e: KeyboardEvent) => keyUp(e)}
               fn={data(tdi.newTitle)}/>;

    return view;
}