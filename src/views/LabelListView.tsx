import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp, ILabel } from "../interfaces"
import { queryTextBox } from "./TaskListActivityView";
import { newLabelView } from "./NewLabelView";


let labelList: HTMLDivElement;


function labelInlineStyle(l: ILabel) {
    return { backgroundColor: l.style.backColor.value, color: l.style.textColor.value };
}


function labelActivate(a: IApp, l: ILabel) {
    if (a.activity.editLabel.label === undefined) {
        a.activity.editLabel.begin(l);
    } else {
        a.activity.selectedTaskList().searchTaskListActivity.addOrRemoveLabelFromQuery(l);
        setTimeout(() => queryTextBox.focus());
    }
}


export const labelListView = (a: IApp) =>
    <div ref={labelList} className="label-list">
        <div id="label-list-inner">
            {newLabelView(a)}
            {a.data.labels.items.map(l =>
                <span className={"label" +
            (a.activity.selectedTaskList().searchTaskListActivity.taskQueryText()
                .indexOf(l.name) ===
                -1
                ? ""
                : " searched-label")}
                      onMouseDown={() => labelActivate(a, l)}
                      style={labelInlineStyle(l)}>
                    {l.name}
                </span>)()}
        </div>
    </div>