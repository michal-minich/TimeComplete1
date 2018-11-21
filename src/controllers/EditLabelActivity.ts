import { IEditLabelActivity, ILabel, IApp, ValueSignal } from "../interfaces";
import Color from "../data/Color";
import { editLabelDiv } from "../views/EditLabelView";
import { R } from "../common";


export default class EditLabelActivity implements IEditLabelActivity {

    constructor(app: IApp) {
        this.app = app;
        this.editLabelName = R.data("");
        this.editColor = R.data("");
        this.nextModeNameSignal = R.data("Edit");
        this.labelSignal = R.data(undefined);
    }


    private readonly app: IApp;
    readonly editLabelName: ValueSignal<string>;
    readonly editColor: ValueSignal<string>;
    private readonly nextModeNameSignal: ValueSignal<string>;
    private readonly labelSignal: ValueSignal<ILabel | undefined>;


    begin(label: ILabel, el: HTMLSpanElement): void {

        const r = el.getBoundingClientRect();
        const divStyle = editLabelDiv.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 4) + "px";

        this.editLabelName(label.name);
        this.editColor(label.style.backColor.value);
        this.labelSignal(label);
    }


    commit(): void {
        const l = this.labelSignal()!;

        for (let tla of this.app.activity.taskLists.items()) {
            const qt = R.sample(tla.searchTaskListActivity.query.text);
            tla.searchTaskListActivity.query.text(qt.replace("#" + l.name,
                "#" + this.editLabelName()));
        }

        l.name = this.editLabelName();
        l.style.backColor = new Color(this.editColor());
        this.cleanup();
    }


    rollback(): void {
        this.cleanup();
    }


    cleanup(): void {
        this.labelSignal(undefined);
        this.editLabelName("");
        this.editColor("");
        this.switchMode();
    }


    delete(): void {
        R.freeze(() => {
            const l = this.labelSignal()!;
            for (let t of this.app.data.tasks()) {
                t.associatedLabels.remove(l);
            }
            for (let tla of this.app.activity.taskLists.items()) {
                const qt = R.sample(tla.searchTaskListActivity.query.text);
                tla.searchTaskListActivity.query.text(qt.replace("#" + l.name, ""));
            }
            this.app.data.labels.remove(l);
            this.cleanup();
        });
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }


    switchMode(): void {
        const mode = this.nextModeNameSignal() === "Edit" ? "Cancel" : "Edit";
        this.nextModeNameSignal(mode);
    }


    get nextModeName(): string {
        return this.nextModeNameSignal();
    }


    get label(): ILabel | undefined {
        return this.labelSignal();
    }
}