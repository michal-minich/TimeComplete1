import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { labelInlineStyle } from "./MainView";
import LabelStyle from "../data/LabelStyle";
import Color from "../data/Color";
import { ILabel, IApp, ValueSignal } from "../interfaces";
import { R } from "../common";


export let beginEditLabel: (label: ILabel, el: HTMLSpanElement) => void;


export const editLabelView = (a: IApp) => {


    const editLabelName = R.data("");
    const editColor = R.data("");
    const nextModeNameSignal = R.data("Edit");
    const labelSignal: ValueSignal<ILabel | undefined> = R.data(undefined);

    const view =
        <div className={"edit-label " + (labelSignal() === undefined ? "hidden" : "")}>
            <span
                className="label"
                style={labelInlineStyle(new LabelStyle(
                    new Color(editColor()),
                    new Color("white")))}>
                {editLabelName}
            </span>
            <br/>
            <input type="text"
                   fn={data(editLabelName)}
                   onKeyUp={(e: KeyboardEvent) => keyUp(e)}/>
            <br/>
            <input type="text"
                   fn={data(editColor)}
                   onKeyUp={(e: KeyboardEvent) => keyUp(e)}/>
            <br/>
            <button onClick={() => confirm()}>Ok</button>
            <button onClick={() => cancel()}>Cancel</button>
            <button onClick={() => del()}>Delete</button>
        </div>;


    function begin(label: ILabel, el: HTMLSpanElement): void {

        const r = el.getBoundingClientRect();
        const divStyle = view.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 4) + "px";

        editLabelName(label.name);
        editColor(label.style.backColor.value);
        labelSignal(label);
    }


    beginEditLabel = begin;


    function confirm(): void {
        const l = labelSignal()!;

        for (let tla of a.activity.taskLists.items()) {
            const qt = R.sample(tla.searchTaskListActivity.query.text);
            tla.searchTaskListActivity.query.text(qt.replace("#" + l.name,
                "#" + editLabelName()));
        }

        l.name = editLabelName();
        l.style.backColor = new Color(editColor());
        cleanup();
    }


    function cancel(): void {
        cleanup();
    }


    function cleanup(): void {
        labelSignal(undefined);
        editLabelName("");
        editColor("");
        switchMode();
    }


    function del(): void {
        R.freeze(() => {
            const l = labelSignal()!;
            for (let t of a.data.tasks()) {
                t.associatedLabels.remove(l);
            }
            for (let tla of a.activity.taskLists.items()) {
                const qt = R.sample(tla.searchTaskListActivity.query.text);
                tla.searchTaskListActivity.query.text(qt.replace("#" + l.name, ""));
            }
            a.data.labels.remove(l);
            cleanup();
        });
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            confirm();
        } else if (e.key === "Escape") {
            cancel();
        }
    }


    function switchMode(): void {
        const mode = nextModeNameSignal() === "Edit" ? "Cancel" : "Edit";
        nextModeNameSignal(mode);
    }


    return view;
};