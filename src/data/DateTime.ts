﻿import { IDateTime } from "../interfaces";


export class DateTime implements IDateTime {

    value: string;

    constructor(value: string) {
        this.value = value;
    }
}