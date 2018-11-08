import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import { labelInlineStyle } from "./MainView";
import LabelStyle from "../data/LabelStyle";
import Color from "../data/Color";


export let editLabelDiv: HTMLDivElement;


export const editLabelView = (a: IApp) =>
    <div ref={editLabelDiv}
         className={"edit-label " + (a.activity.editLabel.label === undefined ? "hidden" : "")}>
        <span
            className="label"
            style={labelInlineStyle(new LabelStyle(
                new Color(a.activity.editLabel.editColor()),
                new Color("white")))}>
            {a.activity.editLabel.editLabelName}
        </span>
        <br/>
        <input type="text"
               fn={data(a.activity.editLabel.editLabelName)}
               onKeyUp={(e: KeyboardEvent) => a.activity.editLabel.keyUp(e)}/>
        <br/>
        <input type="text"
               fn={data(a.activity.editLabel.editColor)}
               onKeyUp={(e: KeyboardEvent) => a.activity.editLabel.keyUp(e)}/>
        <br/>
        <button onClick={() => a.activity.editLabel.commit()}>Ok</button>
        <button onClick={() => a.activity.editLabel.rollback()}>Cancel</button>
        <button onClick={() => a.activity.editLabel.delete()}>Delete</button>
    </div>;