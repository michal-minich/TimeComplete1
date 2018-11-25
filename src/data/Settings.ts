import { ISettings } from "../interfaces";
import { R } from "../common";


export default class Settings implements ISettings {
    labelPrefix = R.data("#");
    selectedTabIndex = R.data(0);
    dashboardColumnsCount = R.data(3);
    lastId = 0;
}