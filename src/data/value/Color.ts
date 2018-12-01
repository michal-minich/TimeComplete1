import { IColor } from "../../interfaces";


export default class Color implements IColor {

    constructor(readonly value: string) {
    }
}