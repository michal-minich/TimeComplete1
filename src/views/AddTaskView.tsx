import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ITasksDashItem } from "../interfaces";
import QueryMatcher from "../operations/QueryMatcher";
import Task from "../data/Task";


export default function addTaskView(a: IApp, tdi: ITasksDashItem) {


    function confirm(queryText: string): void {
        if (tdi.newTitle() === "")
            return;
        let title = tdi.newTitle();
        tdi.newTitle("");
        const sq = new QueryMatcher(a);
        sq.text(queryText);
        const tq = new QueryMatcher(a);
        tq.text(title);
        for (const l of tq.existingLabels) {
            title = title.replace("#" + l.name, "");
        }
        title = title.trim().replace("  ", " ");
        const t = new Task(a, title);
        associateLabels(t, sq.existingLabels);
        associateLabels(t, tq.existingLabels);
        a.data.tasks.unshift(t);
    }


    function associateLabels(t: Task, ls: ILabel[]) {
        for (const l of ls) {
            t.associatedLabels.push(l);
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