import {
		IApp,
		ISyncLog,
		ISyncEvent,
		WhatEvent,
		ITask,
		ILabel,
		ILabelCreateEvent,
		INote,
		ITab,
		ITaskCreateEvent,
		ValueSignal,
		IDomainObject,
		IDeleteEvent,
		INoteCreateEvent,
		ITabCreateEvent,
		IColorStyle,
		IColorStyleChangeEvent
	}
	from "../interfaces";
import { R } from "../common";


export class SyncLog implements ISyncLog {


	private readonly ses: ISyncEvent[];
	private eventIdCounter = 0;


	constructor(private readonly app: IApp) {
		this.ses = [];
		this.setupSync();
	}


	private setupSync() {

		R.onArrayChange(this.app.data.labels,
			(l) => this.pushLabelCreate(l),
			(l) => this.pushDelete(l));

		R.onArrayChange(this.app.data.tasks,
			(t) => this.pushTaskCreate(t),
			(t) => this.pushDelete(t));

		R.onArrayChange(this.app.data.notes,
			(n) => this.pushNoteCreate(n),
			(n) => this.pushDelete(n));

		R.onArrayChange(this.app.data.tabs,
			(t) => this.pushTabCreate(t),
			(t) => this.pushDelete(t));

		this.pushFieldChange(
			"settings.labelPrefix",
			this.app.data.settings.labelPrefix);

		this.pushFieldChange(
			"settings.negationOperator",
			this.app.data.settings.negationOperator);

		this.pushFieldChange(
			"settings.selectedTabIndex",
			this.app.data.settings.selectedTabIndex);

		this.pushFieldChange(
			"settings.dashboardColumnsCount",
			this.app.data.settings.dashboardColumnsCount);
	}

	push(we: WhatEvent, data: any) {
		const se: ISyncEvent = {
			eventId: ++this.eventIdCounter,
			on: this.app.clock.now().value,
			what: we,
			data: data
		};
		this.ses.push(se);
		console.log(se);
	}

	pushDelete(o: IDomainObject): void {
		const d: IDeleteEvent = { id: o.id };
		this.push("object.delete", d);
	}


	pushFieldChange<T>(we: WhatEvent, s: ValueSignal<T>) {
		R.on(s, () => this.push(we, { value: s() }));
	}


	pushLabelCreate(l: ILabel): void {
		const d: ILabelCreateEvent = {
			type: l.type,
			id: l.id,
			createdOn: l.createdOn.value,
			name: l.name,
			style: this.getColorStyle(l.style)
		};
		this.push("label.style", d);
	}


	pushTaskCreate(t: ITask): void {
		const d: ITaskCreateEvent = {
			type: t.type,
			id: t.id,
			createdOn: t.createdOn.value,
			title: t.title
		};
		this.push("object.add", d);
	}


	pushNoteCreate(n: INote): void {
		const d: INoteCreateEvent = {
			type: n.type,
			id: n.id,
			createdOn: n.createdOn.value,
			text: n.text
		};
		this.push("object.add", d);
	}


	pushTabCreate(t: ITab): void {
		const d: ITabCreateEvent = {
			type: t.type,
			id: t.id,
			createdOn: t.createdOn.value,
			title: t.title,
			style: this.getColorStyle(t.style)
		};
		this.push("object.add", d);
	}


	private getColorStyle(s: IColorStyle): IColorStyleChangeEvent {
		return {
			backColor: s.backColor.value,
			customTextColor: s.customTextColor.value,
			textColorInUse: s.textColorInUse
		};
	}
}