// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TaskController } from "./controllers";

let resizeStartLeft = -1;
var labelList: HTMLDivElement;

window.addEventListener('mousemove',
    (e: MouseEvent) => {
        if (resizeStartLeft !== -1) {
            document.body.classList.add("noselect");
            labelList.style.width = (e.clientX - labelList.offsetLeft - 10) + "px";
        }
    },
    false);

window.addEventListener('mouseup',
    (e: MouseEvent) => {
        resizeStartLeft = -1;
        document.body.classList.remove("noselect");
    },
    false);

// ReSharper disable once InconsistentNaming
export const AppView = (c: TaskController) =>
    <table id="bodyTable">
        <tbody>
        <tr>
            <td>
                    <div ref={labelList} className="label-list">
                    <input type="text"
                           placeholder="new label"
                           className="new-label-input label"
                           fn={data(c.model.newLabelName)}
                           onKeyUp={(e: KeyboardEvent) => c.addLabel(e)}/>
                    {c.model.labelStore.labels.map(l =>
                        <span
                            className="label"
                            onMouseDown={() => c.model.taskQuery(
                                (c.model.taskQuery().trim() + " #" + l.name()).trim())}
                            style={{ "backgroundColor": l.color().value }}>{l.name()}</span>)()}
                </div>
            </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}></td>
            <td>
                <input
                    type="text"
                    fn={data(c.model.taskQuery)}
                    onKeyDown={() => c.findTask()}/>
                <input
                    type="button"
                    onClick={() => c.model.taskQuery("")}
                    value="Clear"/>

                <br/>

                <input type="text"
                       placeholder="new task"
                       className="new-task-input"
                       onKeyUp={(e: KeyboardEvent) => c.addTask(e)}
                       fn={data(c.model.newTaskName)}/>
                <table className="task-list">
                    <thead></thead>
                    <tbody>{
                        c.findTask().map(t => {
                            var doneChk: HTMLInputElement | undefined = undefined;
                            return <tr>
                                       <td>
                                           <input
                                               ref={doneChk}
                                               type="checkbox"
                                               checked={t.completedOn() !== undefined}
                                               onChange={() => c.changeTaskCompletion(t, doneChk!)}/>
                                       </td>
                                <td className={t.completedOn() !== undefined ? "completed-task" : ""}>{t.title()}</td>
                                       <td>{t.assignedLabels.map(al =>
                                           <span
                                               className="label-tag"
                                               title={al.name()}
                                               style={{ backgroundColor: al.color().value }}></span>)}
                                       </td>
                                   </tr>;
                        })}
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>;