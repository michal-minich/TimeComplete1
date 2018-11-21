import App from "./controllers/App";
import { IApp } from "./interfaces";
import { R } from "./common";


document.addEventListener("DOMContentLoaded",
    () => {
        R.root(() => {
            const app: IApp = new App(document.body);
        });
    }
);