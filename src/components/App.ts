import {
    IApp,
    IData,
    IClock
} from "../interfaces";

import Clock from "../io/Clock";
import mainView from "../views/MainView";
import Data from "./Data";


export default class App implements IApp {

    readonly clock: IClock;
    readonly data: IData;
    
    constructor() {

        this.clock = new Clock();
        this.data = new Data(this);
        this.data.load();
        document.body.appendChild(mainView(this));
    }
}