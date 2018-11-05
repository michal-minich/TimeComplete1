import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";


export const newLabelView = (a: IApp) =>
    <input type="text"
           placeholder="new label"
           className="new-label-input label"
           fn={data(a.activity.addLabel.newName)}
           onKeyUp={(e: KeyboardEvent) => a.activity.addLabel.keyUp(e)}/>