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
        IWindowUc,
        IPopupUc
    }
    from "../../interfaces";
import { colorInlineStyle, R } from "../../common";
import WindowUc from "./../windowUc";
import TasksDashItem from "../../data/dash/TasksDashItem";
import PopupUc from "../PopupUc";
import Label from "../../data/domain/Label";


export default class LabelEditUc implements ILabelEditUc {

    constructor(app: IApp) {

        this.cv = getControllerView(app);
        this.win = new PopupUc(app, this.cv.view);
        this.editWin = new WindowUc(app, this.cv.editView);
        this.cv.setWindow(this.win, this.editWin);
    }


    private readonly win: IPopupUc;
    private readonly editWin: IWindowUc;
    private readonly cv: {
        setWindow: (w: IWindowUc, ew: IWindowUc) => void;
        begin: (label: ILabel, el: HTMLSpanElement) => void,
        view: HTMLElement;
        editView: HTMLElement;
    };


    begin(label: ILabel, el: HTMLSpanElement): void {
        this.win.showBelow(el);
        this.cv.begin(label, el);
    }


    get view() {
        return this.win.view;
    }


    get editView() {
        return this.editWin.view;
    }
}


function getControllerView(app: IApp) {

    let win: IWindowUc;
    let editWin: IWindowUc;
    const editLabelName = R.data("");
    const editColor = R.data("");
    const labelSignal: ValueSignal<ILabel | undefined> = R.data(undefined);


    function begin(label: ILabel, el: HTMLSpanElement): void {
        editLabelName(label.name);
        editColor(label.style.backColor.value);
        labelSignal(label);
    }


    function setWindow(w: IWindowUc, ew: IWindowUc) {
        win = w;
        editWin = ew;
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
        editWin.hide();
        labelSignal(undefined);
        editLabelName("");
        editColor("");
    }


    function duplicate(): void {
        win.hide();
        const l = labelSignal()!;
        const l2 = Label.createNew(
            app,
            l.name,
            new ColorStyle(
                app,
                l.style.backColor,
                l.style.customTextColor,
                l.style.textColorInUse));
        app.data.labelAdd(l2);
        for (const t of app.data.tasks()) {
            if (!(t.associatedLabels().find(al => al.id === l.id)))
                continue;
            t.addLabel(l2);
        }
    }


    function del(): void {
        win.hide();
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
        win.hide();
        const l = labelSignal()!;
        const tdi = new TasksDashItem(app, app.data.fields.labelPrefix + l.name);
        app.data.dashboard.unshift(tdi);
    }


    function edit(e: MouseEvent) {
        win.hide();
        editWin.showBelow(e.target as HTMLElement);
    }


    const view =
        <ul className="add-menu menu">
            <li onClick={showTaskList}>Show Tasks</li>
            <li onClick={duplicate}>Duplicate</li>
            <li onClick={edit}>Edit</li>
            <li onClick={del}>Delete</li>
        </ul>;


    const editView =
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
            <br/>
            <div>
                <input type="text"
                       fn={data(editLabelName)}
                       onKeyUp={keyUp}/>
            </div>
            <div>
                <input type="text"
                       fn={data(editColor)}
                       onKeyUp={keyUp}/>
            </div>
            <button onClick={confirm}>Ok</button>
            <button onClick={cancel}>Cancel</button>
        </div>;

    return { setWindow, begin, view, editView };
}