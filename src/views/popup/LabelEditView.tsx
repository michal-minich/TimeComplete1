import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { colorInlineStyle } from "../MainView";
import ColorStyle from "../../data/value/ColorStyle";
import Color from "../../data/value/Color";
import { ILabel, IApp, ValueSignal, ILabelEditView, IWindowView } from "../../interfaces";
import { R } from "../../common";
import WindowView from "./../windowView";
import TasksDashItem from "../../data/dash/TasksDashItem";


export default class LabelEditView implements ILabelEditView {

    constructor(private readonly app: IApp) {
        this.window = new WindowView(app, this.render());
    }


    private readonly window: IWindowView;
    private readonly editLabelName = R.data("");
    private readonly editColor = R.data("");
    private readonly labelSignal: ValueSignal<ILabel | undefined> = R.data(undefined);


    private render() {
        const view =
            <div className="edit-label">
                <span
                    className="label"
                    style={colorInlineStyle(new ColorStyle(
                        this.app,
                        new Color(this.editColor()),
                        new Color("white")))}>
                    {this.editLabelName}
                </span>
                <br/>
                <input type="text"
                       fn={data(this.editLabelName)}
                       onKeyUp={this.keyUp}/>
                <br/>
                <input type="text"
                       fn={data(this.editColor)}
                       onKeyUp={this.keyUp}/>
                <br/>
                <button onClick={this.confirm}>Ok</button>
                <button onClick={this.cancel}>Cancel</button>
                <button onClick={this.del}>Delete</button>
                <button onClick={this.showTaskList}>Show Task List</button>
            </div>;
        return view;
    }


    get view() {
        return this.window.view;
    }


    begin(label: ILabel, el: HTMLSpanElement): void {
        this.window.showBelow(el);
        this.editLabelName(label.name);
        this.editColor(label.style.backColor.value);
        this.labelSignal(label);
    }


    private confirm: () => void = () => {
        const l = this.labelSignal()!;

        for (const di of this.app.data.dashboard.items()) {
            if (!(di instanceof TasksDashItem))
                continue;
            const qt = R.sample(di.query.text);
            di.query.text(qt.replace("#" + l.name,
                "#" + this.editLabelName()));
        }

        l.name = this.editLabelName();
        l.style.backColor = new Color(this.editColor());
        this.cleanup();
    }


    private cancel: () => void = () => {
        this.cleanup();
    }


    private cleanup: () => void = () => {
        this.window.hide();
        this.labelSignal(undefined);
        this.editLabelName("");
        this.editColor("");
    }


    private del: () => void = () => {
        R.freeze(() => {
            const l = this.labelSignal()!;
            for (const t of this.app.data.tasks()) {
                t.removeLabel(l);
            }
            for (const di of this.app.data.dashboard.items()) {
                if (!(di instanceof TasksDashItem))
                    continue;
                const qt = R.sample(di.query.text);
                di.query.text(qt.replace("#" + l.name, ""));
            }
            this.app.data.labelDelete(l);
            this.cleanup();
        });
    }


    private keyUp: (e: KeyboardEvent) => void = (e) => {
        if (e.key === "Enter") {
            confirm();
        } else if (e.key === "Escape") {
            this.cancel();
        }
    }


    private showTaskList: () => void = () => {
        const l = this.labelSignal()!;
        const tdi = new TasksDashItem(this.app, this.app.data.fields.labelPrefix + l.name);
        this.app.data.dashboard.unshift(tdi);
    }
}