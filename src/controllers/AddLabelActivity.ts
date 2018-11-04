import S from "s-js";
import Label from "../data/Label";
import LabelStyle from "../data/LabelStyle";
import Color from "../data/Color";
import { IApp, IAddLabelActivity } from "../interfaces";


export default class AddLabelActivity implements IAddLabelActivity {

    newName = S.data("");
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    commit(): void {
        if (this.newName() === "")
            return;
        const l = new Label(this.newName(), new LabelStyle(new Color("gray"), new Color("white")));
        this.app.data.labels.addLabel(l);
        this.newName("");
        const t = this.app.activity.selectTask.selectedTask;
        if (t) {
            t.associatedLabels.add(l);
        }
    }


    rollback(): void {
        this.newName("");
    }


    keyUp(e: KeyboardEvent): any {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}