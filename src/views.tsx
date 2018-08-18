// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TaskController } from "./controllers";


// ReSharper disable once InconsistentNaming
export const AppView = (c: TaskController) =>
    <div>
        <input
            type="search"
            fn={data(c.model.taskQuery)}
            onKeyDown={() => c.findTask()}/>
        <input
            type="button"
            onClick={() => c.model.taskQuery("")}
            value="Clear"/>
    
        <div className="label-list">
            <input type="text"
                   placeholder="new label"
                   className="new-label-input label"
                   fn={data(c.model.newLabelName)}
                   onKeyUp={(e : KeyboardEvent) => c.addLabel(e)}/>
                {c.model.labelStore.labels.map(l => <span className="label" style={l.cssColor()}>{l.name()}</span>)()}
        </div>

        <input type="text"
               onKeyUp={(e : KeyboardEvent) => c.addTask(e)}
               fn={data(c.model.newTaskName)}/>

        <table className="task-list">
            <thead></thead>
            <tbody>{
                c.findTask().map(t => {
                    var doneChk: HTMLInputElement | undefined = undefined;
                    return <tr>
                               <td>{t.id}</td>
                               <td>
                                   <input
                                       ref={doneChk}
                                       type="checkbox"
                                       checked={t.completedOn() !== undefined}
                                       onChange={() => c.changeTaskCompletion(t, doneChk!)}/>
                               </td>
                               <td>{t.title()}</td>
                               <td>{t.createdOn.value}</td>
                               <td>{t.completedValue()}</td>
                               <td>{t.assignedLabels.map(al => "#" + al.name() + " ")}</td>
                           </tr>;
                })}
            </tbody>
        </table>
    </div>;