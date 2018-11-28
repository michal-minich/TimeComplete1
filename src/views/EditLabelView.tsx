import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { colorInlineStyle } from "./MainView";
import LabelStyle from "../data/ColorStyle";
import Color from "../data/Color";
import { ILabel, IApp, ValueSignal } from "../interfaces";
import { R } from "../common";
import TasksDashItem from "../data/TasksDashItem";
import windowView from "./windowView";

export type EditLabelView = ReturnType<typeof editLabelView>;


export default function editLabelView(a: IApp) {

    const editLabelName = R.data("");
    const editColor = R.data("");
    const labelSignal: ValueSignal<ILabel | undefined> = R.data(undefined);

    const view =
        <div className="edit-label">
            <span
                className="label"
                style={colorInlineStyle(new LabelStyle(
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


    const wv = windowView(a, view);


    function begin(label: ILabel, el: HTMLSpanElement): void {
        wv.showBelow(el);
        editLabelName(label.name);
        editColor(label.style.backColor.value);
        labelSignal(label);
    }


    function confirm(): void {
        const l = labelSignal()!;

        for (const di of a.dashboard.items()) {
            if (!(di instanceof TasksDashItem))
                continue;
            const qt = R.sample(di.query.text);
            di.query.text(qt.replace("#" + l.name,
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
        wv.hide();
        labelSignal(undefined);
        editLabelName("");
        editColor("");
    }


    function del(): void {
        R.freeze(() => {
            const l = labelSignal()!;
            for (const t of a.data.tasks()) {
                t.associatedLabels.remove(l);
            }
            for (const di of a.dashboard.items()) {
                if (!(di instanceof TasksDashItem))
                    continue;
                const qt = R.sample(di.query.text);
                di.query.text(qt.replace("#" + l.name, ""));
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


    return { view: wv.view, begin };
};