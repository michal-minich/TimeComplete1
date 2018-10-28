import { IDateTime } from "../interfaces";


export default class DateTime implements IDateTime {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}