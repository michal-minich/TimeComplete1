import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp, ILabel } from "../interfaces"
import { queryTextBox } from "./TaskListActivityView";
import { newLabelView } from "./NewLabelView";
import { labelInlineStyle } from "./MainView";


let labelList: HTMLDivElement;


function labelActivate(a: IApp, l: ILabel, el: HTMLSpanElement) {
    if (a.activity.editLabel.nextModeName === "Cancel") {
        a.activity.editLabel.begin(l, el);
    } else {
        a.activity.selectedTaskList().searchTaskListActivity.addOrRemoveLabelFromQuery(l);
        setTimeout(() => queryTextBox.focus());
    }
}


export const labelListView = (a: IApp) =>
    <div ref={labelList} className="label-list">
        <div id="label-list-inner">
            {newLabelView(a)}
            {a.data.labels.items.map(l => {
                let el: HTMLSpanElement | undefined;
                return <span
                           ref={el}
                           className={"label" +
            (a.activity.selectedTaskList().searchTaskListActivity.taskQueryText().indexOf(l.name) ===
                -1
                ? ""
                : " searched-label")}
                           onMouseDown={() => labelActivate(a, l, el!)}
                           style={labelInlineStyle(l.style)}>
                           {l.name}
                       </span>;;
            })()}
        </div>
    </div>;