import S from "s-js";

import App from "./controllers/App";
import { IApp } from "./interfaces";
import { view } from "./views";


S.root(() => {
    const app: IApp = new App();
    document.body.appendChild(view(app));
    //setTimeout(() => queryTextBox.focus(), 100);
});