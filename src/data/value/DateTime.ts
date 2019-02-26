import { IDateTime } from "../../interfaces";


export default class DateTime implements IDateTime {


    private readonly jsDate : Date;


    constructor(readonly value: number) {
        this.jsDate = new Date(this.value);
    }


    toLocaleDateTimeString(): string {
        return this.jsDate.toLocaleString();
    }
}