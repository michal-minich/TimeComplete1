import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import ColorStyle from "../../data/value/ColorStyle";
import Color from "../../data/value/Color";
import {
        ILabel,
        IApp,
        ValueSignal,
        ILabelEditUc,
        IWindowUc
    }
    from "../../interfaces";
import { colorInlineStyle, R } from "../../common";
import WindowUc from "./../windowUc";
import TasksDashItem from "../../data/dash/TasksDashItem";


export default class LabelEditUc implements ILabelEditUc {

    constructor(app: IApp) {

        this.cv = getControllerView(app);
        this.win = new WindowUc(app, this.cv.view);
        this.cv.setWindow(this.win);
    }


    private readonly win: IWindowUc;
    private readonly cv: {
        setWindow: (w: IWindowUc) => void;
        begin: (label: ILabel, el: HTMLSpanElement) => void,
        view: HTMLElement;
    };


    begin(label: ILabel, el: HTMLSpanElement): void {
        this.win.showBelow(el);
        this.cv.begin(label, el);
    }


    get view() {
        return this.win.view;
    }
}


function getControllerView(app: IApp) {

    let win: IWindowUc;
    const editLabelName = R.data("");
    const editColor = R.data("");
    const labelSignal: ValueSignal<ILabel | undefined> = R.data(undefined);


    function begin(label: ILabel, el: HTMLSpanElement): void {
        editLabelName(label.name);
        editColor(label.style.backColor.value);
        labelSignal(label);
    }


    function setWindow(w: IWindowUc) {
        win = w;
    }

    function confirm(): void {
        const l = labelSignal()!;

        for (const di of app.data.dashboard.items()) {
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
        win.hide();
        labelSignal(undefined);
        editLabelName("");
        editColor("");
    }


    function del(): void {
        R.freeze(() => {
            const l = labelSignal()!;
            for (const t of app.data.tasks()) {
                t.removeLabel(l);
            }
            for (const di of app.data.dashboard.items()) {
                if (!(di instanceof TasksDashItem))
                    continue;
                const qt = R.sample(di.query.text);
                di.query.text(qt.replace("#" + l.name, ""));
            }
            app.data.labelDelete(l);
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


    function showTaskList(): void {
        const l = labelSignal()!;
        const tdi = new TasksDashItem(app, app.data.fields.labelPrefix + l.name);
        app.data.dashboard.unshift(tdi);
    }


    const view =
        <div className="edit-label">
            <span
                className="label"
                style={colorInlineStyle(new ColorStyle(
                    app,
                    new Color(editColor()),
                    new Color("white")))}>
                {editLabelName}
            </span>
            <br/>
            <input type="text"
                   fn={data(editLabelName)}
                   onKeyUp={keyUp}/>
            <br/>
            <input type="text"
                   fn={data(editColor)}
                   onKeyUp={keyUp}/>
            <br/>
            <button onClick={confirm}>Ok</button>
            <button onClick={cancel}>Cancel</button>
            <button onClick={del}>Delete</button>
            <button onClick={showTaskList}>Show Task List</button>
        </div>;

    return { setWindow, begin, view };
}