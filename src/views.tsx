// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TaskController } from "./controllers";


// ReSharper disable once InconsistentNaming
export const AppView = (c: TaskController) =>
    <div>
        <input type="search"
               fn={data(c.model.taskName)}/>
        <input
            type="button"
            onClick={() => c.addTask()}
            value="Add"/>
        <hr/>
        <input
            type="text"
            fn={data(c.model.taskQuery)}
            onKeyDown={() => c.findTask()}/>
        <input
            type="button"
            onClick={() => c.model.taskQuery("")}
            value="Clear"/>
        <br/>
        <table className="taskList">
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