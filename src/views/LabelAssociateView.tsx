import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp, ILabel, RArray } from "../interfaces";
import { newLabelView } from "./NewLabelView";
import { labelInlineStyle } from "./MainView";


let assignLabelPopup: HTMLDivElement;


function labelActivate(a: IApp, l: ILabel, el: HTMLSpanElement) {
    if (a.activity.editLabel.nextModeName === "Cancel") {
        a.activity.editLabel.begin(l, el);
    } else {
        a.activity.associateLabelWithTask.changeAssociation(l);
    }
}


export const labelAssociateView = (a: IApp) =>
    !a.activity.selectTask.selectedTask
    ? ""
    : <div className="assign-label-activity label-list" ref={assignLabelPopup}>
          <div className="smaller-font">Associated</div>
          <div id="associated-labels">
              {newLabelView(a.activity.addLabel)}
              {associateLabelList(a,
                  a.activity.selectTask.selectedTask!.associatedLabels.items)()}
          </div>
          <div className="smaller-font">Available</div>
          <div id="available-labels">
              {associateLabelList(a,
                  a.data.labels.items
                  .filter(l => !a.activity.selectTask.selectedTask!.associatedLabels.items()
                      .some(al => al.name === l.name)))
              }
          </div>
      </div>;


const associateLabelList = (a: IApp, labels: RArray<ILabel>) =>
    labels.map(l => {
        let el: HTMLSpanElement | undefined;
        return <span
                   ref={el}
                   className="label"
                   style={labelInlineStyle(l.style)}
                   onMouseDown={() => labelActivate(a, l, el!)}>
                   {l.name}
               </span>;
    });