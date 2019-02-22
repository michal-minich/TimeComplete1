import App from "./components/App";
import { IApp } from "./interfaces";
import { R } from "./common";


async function test1() {
    const req = new Request("http://localhost:55111/api/values");
    const response = await fetch(req);
    const json = await response.json();
    console.log(json);
}


document.addEventListener("DOMContentLoaded",
    () => {
        // test1();
        R.root(() => {
            const app: IApp = new App(document.body);
            (window as any).app = app; // for debugging in browser
        });
    });