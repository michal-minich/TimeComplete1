import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import LabelStyle from "../data/ColorStyle";
import Color from "../data/value/Color";
import { R } from "../common";
import Label from "../data/domain/Label";
import { IApp } from "../interfaces";


export const labelAddView = (a: IApp) => {

    const newName = R.data("");


    const view = <input type="text"
                        placeholder="new label"
                        className="new-label-input label"
                        fn={data(newName)}
                        onKeyUp={keyUp}/>;


    function confirm(): void {
        if (newName() === "")
            return;
        const l = Label.createNew(a,
            newName(),
            new LabelStyle(new Color("gray"), new Color("white")));
        a.data.labelAdd(l);
        newName("");
        const t = a.data.selectedTask;
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