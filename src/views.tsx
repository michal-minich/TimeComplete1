// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TaskController } from "./controllers";


// ReSharper disable once InconsistentNaming
export const AppView = (c: TaskController) =>
    <div>
        <input type="text"
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
        <br/>
        <table className="taskList">
            <thead></thead>
            <tbody>{
                c.findTask().map(t =>
                    <tr>
                        <td>{t.id}</td>
                        <td>{t.title()}</td>
                    </tr>)}
            </tbody>
        </table>
    </div>;