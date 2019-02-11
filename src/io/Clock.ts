import DateTime from "../data/value/DateTime";
import { IDateTime, IClock } from "../interfaces";


export default class Clock implements IClock {

    now(): IDateTime {
        return new DateTime(Date.now());
    }
}