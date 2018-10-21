import { IApp, ILabel, IAssociateLabelWithTaskActivity } from "../interfaces";


export class AssociateLabelWithActivity implements IAssociateLabelWithTaskActivity {
    private readonly app: IApp;

    constructor(app: IApp) {
        this.app = app;
    }

    changeAssociation(label: ILabel): void {
        const t = this.app.selectTaskActivity.selectedTask()!;
        if (t.assignedLabels().some(al => al.name() === label.name())) {
            t.removeLabelAssociation(label);
        } else {
            t.addLabelAssociation(label);
        }
    }
}