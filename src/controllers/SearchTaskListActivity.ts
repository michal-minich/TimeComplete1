import S from "s-js";
import { TaskQueryParser, TaskQuery } from "../operations/query";
import { IApp, ISearchTaskListActivity, ITask, ILabel } from "../interfaces";


export class SearchTaskListActivity implements ISearchTaskListActivity {

    taskQueryText = S.data("");
    taskQuery = S.data(new TaskQuery([]));
    private originalTitle = "";
    private readonly app: IApp;
    private text: string = "";


    constructor(app: IApp) {
        this.app = app;
    }


    private searchedTasks(taskQuery: string): ITask[] {
        if (taskQuery !== this.text) {
            this.text = taskQuery;
            const q = new TaskQueryParser().parse(taskQuery);
            this.taskQuery(q);
            this.app.activity.save();
        }
        return this.app.data.tasks.items().filter(t => this.taskQuery().taskMatches(t));
    }


    resultTasks(): ITask[] {
        return this.searchedTasks(this.taskQueryText());
    }


    begin(): void {
        this.originalTitle = this.taskQueryText();
        this.app.activity.selectTask.unselect();
    }


    addSearch(): void {
    }


    rollback(): void {
        if (this.originalTitle === "__NEXT_EMPTY__") {
            this.originalTitle = this.taskQueryText();
            this.clear();

        } else {
            this.taskQueryText(this.originalTitle);
            this.originalTitle = "__NEXT_EMPTY__";
        }
    }


    clear(): void {
        this.taskQueryText("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 27)
            this.rollback();
    }


    addOrRemoveLabelFromQuery(l: ILabel): void {
        const ln = l.name;
        const q = this.taskQueryText().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.taskQueryText(q + " #" + ln);
        } else {
            this.taskQueryText(q.replace("#" + ln, "").replace("  ", " "));
        }
    }
}