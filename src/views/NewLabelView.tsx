import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import LabelStyle from "../data/LabelStyle";
import Color from "../data/Color";
import { R } from "../common";
import Label from "../data/Label";
import { IApp } from "../interfaces";


export const newLabelView = (a: IApp) => {

    const newName = R.data("");


    const view = <input type="text"
                        placeholder="new label"
                        className="new-label-input label"
                        fn={data(newName)}
                        onKeyUp={keyUp}/>;


    function confirm(): void {
        if (newName() === "")
            return;
        const l = new Label(a, newName(), new LabelStyle(new Color("gray"), new Color("white")));
        a.data.labels.unshift(l);
        newName("");
        const t = a.activity.selectTask.selectedTask;
        if (t) {
            t.associatedLabels.push(l);
        }
    }


    function cancel(): void {
        newName("");
    }


    function keyUp(e: KeyboardEvent): any {
        if (e.key === "Enter")
            confirm();
        else if (e.key === "Escape")
            cancel();
    }


    return view;
};