import { IApp, ILabel, IAssociateLabelWithTaskActivity } from "../interfaces";


export default class AssociateLabelWithTaskActivity implements IAssociateLabelWithTaskActivity {

    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }

    changeAssociation(label: ILabel): void {
        const t = this.app.activity.selectTask.selectedTask!;
        if (t.associatedLabels().some(al => al.name === label.name)) {
            t.associatedLabels.remove(label);
        } else {
            t.associatedLabels.push(label);
        }
    }
}