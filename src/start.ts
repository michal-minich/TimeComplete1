import S from "s-js";

import { App } from "./controllers/App";
import { IApp } from "./interfaces";
import { AppView } from "./views";


S.root(() => {
    const app: IApp = new App();

    const view = AppView.view(app);
    document.body.appendChild(view);
    
    setTimeout(() => AppView.queryTextBox.focus(), 100);
});