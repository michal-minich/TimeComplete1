import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";


export const editLabelView = (a: IApp) =>
    <div>
        <input type="text"
               className="label"
               fn={data(a.activity.editLabel.editLabelName)}
               onKeyUp={(e: KeyboardEvent) => a.activity.editLabel.keyUp(e)}/>
        <button onClick={() => a.activity.editLabel.save()}>Ok</button>
        <button onClick={() => a.activity.editLabel.cancel()}>Cancel</button>
    </div>;