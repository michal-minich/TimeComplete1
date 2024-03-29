import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    ITask,
    ILabel,
    ILabelsPopupUc,
    ITaskTitleEditUc,
    ITaskListUc
} from "../../interfaces";
import { onMouseDown } from "../../common";
import DateTime from "../../data/value/DateTime";


export default class TaskListUc implements ITaskListUc {

    constructor(app: IApp,
        tasks: ITask[],
        lpv: ILabelsPopupUc,
        ettv: ITaskTitleEditUc) {

        this.view = getControlledView(app, tasks, lpv, ettv);
    }

    readonly view: HTMLElement[];
}


function getControlledView(app: IApp,
    tasks: ITask[],
    lpv: ILabelsPopupUc,
    ettv: ITaskTitleEditUc): HTMLElement[] {


    function perform(task: ITask, isDone: HTMLInputElement): any {
        if (isDone.checked) {
            task.completedOn = new DateTime(Date.now());
        } else {
            task.completedOn = undefined;
        }
    }


    function changeAssociation(label: ILabel): void {
        const t = app.data.selectedTask!;
        if (t.associatedLabels().some(al => al.name === label.name)) {
            t.removeLabel(label);
        } else {
            t.addLabel(label);
        }
    }


    const view = tasks.map(t => {
        let doneChk: HTMLInputElement | undefined = undefined;
        let titleTd: HTMLTableDataCellElement | undefined = undefined;
        const view2 =
            <tr onMouseDown={() => app.data.selectedTask = t}
                className={app.data.selectedTask === t ? "selected-task" : ""}>
                <td>
                    <input
                        ref={doneChk}
                        type="checkbox"
                        checked={t.completedOn !== undefined}
                        onChange={() => perform(t, doneChk!)}/>
                </td>
                <td ref={titleTd}
                    title={"Created: " +
                        t.createdOn.toLocaleDateTimeString() +
                        (t.completedOn
                            ? "\nCompleted: " +
                            t.completedOn.toLocaleDateTimeString()
                            : "")}
                    tabIndex={1}
                    onFocus={() => ettv.begin(t, titleTd!)}
                    className={t.completedOn !== undefined
                        ? "completed-task"
                        : ""}>
                    {t.title}
                </td>
                <td className="label-tag-container"
                    fn={(onMouseDown((e) => lpv.show(
                        e.target as HTMLElement,
                        t.associatedLabels,
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
}