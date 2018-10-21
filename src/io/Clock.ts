import { DateTime } from "../data/DateTime";
import { IDateTime, IClock } from "../interfaces";

export class Clock implements IClock {

    now(): IDateTime {
        return new DateTime("2018");
    }
}