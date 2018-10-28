import { IColor } from "../interfaces";


export default class Color implements IColor {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}