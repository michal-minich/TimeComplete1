import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IAddLabelActivity } from "../interfaces";


export const newLabelView = (ada: IAddLabelActivity) =>
    <input type="text"
           placeholder="new label"
           className="new-label-input label"
           fn={data(ada.newName)}
           onKeyUp={(e: KeyboardEvent) => ada.keyUp(e)}/>