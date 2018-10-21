import { IDateTime } from "../interfaces";


export class DateTime implements IDateTime {
    constructor(value: string) {
        this.value = value;
    }

    value = "";
}