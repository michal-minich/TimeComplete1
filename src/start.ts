import S from "s-js";

import App from "./controllers/App";
import { IApp } from "./interfaces";
import { mainView } from "./views/MainView";


S.root(() => {
    const app: IApp = new App();
    document.body.appendChild(mainView(app));
    //setTimeout(() => queryTextBox.focus(), 100);
});