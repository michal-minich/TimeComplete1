import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp, ILabel, RArray } from "../interfaces";
import { newLabelView } from "./NewLabelView";


let assignLabelPopup: HTMLDivElement;


function labelInlineStyle(l: ILabel) {
    return { backgroundColor: l.style.backColor.value, color: l.style.textColor.value };
}


export const labelAssociateView = (a: IApp) =>
    !a.activity.selectTask.selectedTask
    ? ""
    : <div id="assign-label-activity" className="label-list" ref={assignLabelPopup}>
          <div className="smaller-font">Associated</div>
          <div id="associated-labels">
              {newLabelView(a)}
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
    labels.map(l =>
        <span className="label"
              style={labelInlineStyle(l)}
              onMouseDown={() => a.activity.associateLabelWithTask.changeAssociation(l)}>
            {l.name}
        </span>);