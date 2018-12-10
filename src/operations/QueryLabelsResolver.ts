import { IApp, ILabel } from "../interfaces";
import { QueryParser, QueryLabel, NotOp } from "./QueryParser";


export module QueryLabelsResolver {

    export type ResolveLabels = ReturnType<typeof resolveLabelTitle>


    export function resolveLabelTitle(app: IApp, title: string) {

        const tokens = QueryParser.parse(app, title);

        const queryLabelElements = tokens
            .filter(tok => tok instanceof QueryLabel) as QueryLabel[];

        const existingLabelElements = app.data.labels()
            .filter(l => queryLabelElements.some(qle => l.name === qle.value));

        const nonExistingLabelElements = queryLabelElements
            .filter(qle => !existingLabelElements.some(l => l.name === qle.value));

        const labelsToInclude = existingLabelElements.map(l => l.name)
            .concat(nonExistingLabelElements.map(qle => qle.value));

        const labelsToExclude = (tokens
                .filter(tok => tok instanceof NotOp && tok.arg instanceof QueryLabel) as NotOp[])
            .map(no => no.arg as QueryLabel);
        
        const nonLabelTokens = tokens
            .filter(tok => !(tok instanceof QueryLabel));

        const titleWithoutLabels = QueryParser.makeString(nonLabelTokens);

        return {
            tokens,
            queryLabelElements,
            labelsToInclude,
            labelsToExclude,
            existingLabelElements,
            nonExistingLabelElements,
            titleWithoutLabels
        };
    }


    export function createLabels(labels: string[]) {
    }


    export function resolveLabelsAssociationAndTitle(
        rl: ResolveLabels,
        currentLabels: ILabel[]) {

    }
}