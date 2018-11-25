import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp, ITask, ILabel } from "../interfaces";
import { onMouseDown } from "../common";
import { LabelsPopupView } from "./LabelsPopupView";
import DateTime from "../data/DateTime";
import { EditTaskTitleView } from "./EditTaskTitleView";


export default function taskListView(a: IApp,
    tasks: ITask[],
    lpv: LabelsPopupView,
    ettv: EditTaskTitleView) {


    function perform(task: ITask, isDone: HTMLInputElement): any {
        if (isDone.checked) {
            task.completedOn = new DateTime("2019");
        } else {
            task.completedOn = undefined;
        }
    }


    function changeAssociation(label: ILabel): void {
        const t = a.data.selectedTask!;
        if (t.associatedLabels().some(al => al.name === label.name)) {
            t.associatedLabels.remove(label);
        } else {
            t.associatedLabels.push(label);
        }
    }


    const view = tasks.map(t => {
        let doneChk: HTMLInputElement | undefined = undefined;
        let titleTd: HTMLTableDataCellElement | undefined = undefined;
        const view2 =
            <tr onMouseDown={() => a.data.selectedTask = t}
                className={a.data.selectedTask === t ? "selected-task" : ""}>
                <td>
                    <input
                        ref={doneChk}
                        type="checkbox"
                        checked={t.completedOn !== undefined}
                        onChange={() => perform(t, doneChk!)}/>
                </td>
                <td ref={titleTd}
                    tabIndex={1}
                    onFocus={() => ettv.begin(t, titleTd!)}
                    className={t.completedOn !== undefined
                        ? "completed-task"
                        : ""}>
                    {t.title}
                </td>
                <td className="label-tag-container"
                    fn={(onMouseDown((e) => lpv.show(e.target as HTMLElement,
                        (l, el) => changeAssociation(l)
                    )))}>
                    {t.associatedLabels.orderBy(al => al.id).map(al =>
                        <span
                            className="label-tag"
                            title={al.name}
                            style={{ backgroundColor: al.style.backColor.value }}>
                        </span>)}
                </td>
            </tr>;

        return view2;

    });

    return view;
};