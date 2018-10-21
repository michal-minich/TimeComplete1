import S from "s-js";
import { ILabel } from "../interfaces";
import { Task, Color, DateTime } from "./all";


export class Label implements ILabel {
    name = S.data("");
    color = S.data(new Color("gray"));
    id = ++Task.counter;
    createdOn = new DateTime("2018");
}