﻿import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { IApp } from "../interfaces";
import { queryBackground } from "./TaskListActivityView";


export const taskListsSearchesView = (a: IApp) =>
    <div className="task-list-searches">
        <div className="smaller-font">Task Lists</div>
        <div>{
            a.activity.taskLists.items.map(tla =>
                <span className="label" style={queryBackground(tla)}>{() => {
                        const qt = tla.searchTaskListActivity.taskQueryText();
                        return qt === "" ? "(empty)" : qt;
                    }}</span>)
        }</div>
    </div>;