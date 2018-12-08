import LocalStore from "../io/LocalStore";
import Clock from "../io/Clock";
import {
    IApp,
    IData,
    IDataStore,
    IClock,
    IDashboard
} from "../interfaces";
import mainView from "../views/MainView";
import Data from "../data/Data";


export default class App implements IApp {

    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly data: IData;

	
	constructor(el: Element) {

        this.localStore = new LocalStore();
        this.clock = new Clock();
        this.data = new Data(this);
        this.data.load();

        el.appendChild(mainView(this));
    }


    get dashboard(): IDashboard {
        const d = this.data;
        return d.tabs()[d.settings.selectedTabIndex].content as IDashboard;
    }
}