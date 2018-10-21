﻿import S from "s-js";
import { Label } from "../data/Label";
import { Color } from "../data/Color";
import { IApp, IAddLabelActivity } from "../interfaces";

export class AddLabelActivity implements IAddLabelActivity {

    newName = S.data("");
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    commit(): void {
        if (this.newName() === "")
            return;
        const l = new Label(this.newName(), new Color("gray"));
        this.app.labelStore.addLabel(l);
        this.newName("");
        const t = this.app.selectTaskActivity.selectedTask();
        if (t) {
            t.addLabelAssociation(l);
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