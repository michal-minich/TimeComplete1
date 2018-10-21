import { IColor } from "../interfaces";


export class Color implements IColor {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}