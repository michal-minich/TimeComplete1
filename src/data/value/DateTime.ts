import { IDateTime } from "../../interfaces";


export default class DateTime implements IDateTime {

    constructor(readonly value: number) {
    }


    toLocaleDateTimeString(): string {
        return new Date(this.value).toLocaleString();
    }
}