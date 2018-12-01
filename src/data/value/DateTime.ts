import { IDateTime } from "../../interfaces";


export default class DateTime implements IDateTime {

    constructor(readonly value: string) {
    }
}