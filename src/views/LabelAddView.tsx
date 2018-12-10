import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import LabelStyle from "../data/value/ColorStyle";
import Color from "../data/value/Color";
import { R } from "../common";
import Label from "../data/domain/Label";
import { IApp } from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";


export const labelAddView = (app: IApp) => {

    const newName = R.data("");


    let isForTask: boolean = false;


    const view = <input type="text"
                        placeholder="new label"
                        className="new-label-input label"
                        fn={data(newName)}
                        onKeyUp={keyUp}/>;


    function confirm(): void {
        const labelName = newName();
        if (labelName === "")
            return;
        const l = Label.createNew(
            app,
            labelName,
            new LabelStyle(app, new Color("gray"), new Color("white")));
        app.data.labelAdd(l);
        newName("");
        if (isForTask) {
            const t = app.data.selectedTask;
            if (t)
                t.addLabel(l);
        }
        addTaskList(labelName);
    }


    function cancel(): void {
        newName("");
    }


    function addTaskList(query: string) {
        const tdi = new TasksDashItem(app, query);
        app.data.dashboard.unshift(tdi);
    }


    function keyUp(e: KeyboardEvent): any {
        if (e.key === "Enter")
            confirm();
        else if (e.key === "Escape")
            cancel();
    }


    return { view, isForTask };
};