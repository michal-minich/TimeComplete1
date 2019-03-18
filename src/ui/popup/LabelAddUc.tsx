import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import LabelStyle from "../../data/value/ColorStyle";
import Color from "../../data/value/Color";
import { R } from "../../common";
import Label from "../../data/domain/Label";
import { IApp, ILabelAddUc } from "../../interfaces";
import TasksDashItem from "../../data/dash/TasksDashItem";


export var labelAddUcState: {
    isForTask: boolean;
    hideWindow: () => void;
} = { isForTask: false, hideWindow: () => {} };


export default class LabelAddUc implements ILabelAddUc {

    constructor(app: IApp) {

        this.view = getControlledView(app);
    }

    readonly view: HTMLElement;
}


function getControlledView(app: IApp): HTMLElement {

    const newName = R.data("");


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
        if (labelAddUcState.isForTask) {
            const t = app.data.selectedTask;
            if (t)
                t.addLabel(l);
        }
        addTaskList(app.data.fields.labelPrefix + labelName);
        labelAddUcState.hideWindow();
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


    const view = <input type="text"
                        placeholder="new label"
                        className="new-label-input label"
                        fn={data(newName)}
                        onKeyUp={keyUp}/>;

    return view;
}