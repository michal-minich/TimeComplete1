import S from "s-js";

import App from "./controllers/App";
import { IApp } from "./interfaces";
import { mainView } from "./views/MainView";


document.addEventListener("DOMContentLoaded",
    () => {
        S.root(() => {
            const app: IApp = new App();
            document.body.appendChild(mainView(app));
        });
    }
);