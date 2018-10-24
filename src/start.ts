import S from "s-js";

import { App } from "./controllers/App";
import { IApp } from "./interfaces";
import { SSerializer } from "./operations/Serializer";
import { AppView } from "./views";


S.root(() => {
    const app: IApp = new App();

    const view = AppView.view(app);
    document.body.appendChild(view);

    var s = new SSerializer();
    //console.log(s.toPlain(app.data.labels.labels()));
    //console.log(s.toPlain(app.data.tasks.tasks()));

    setTimeout(() => AppView.queryTextBox.focus(), 100);
});