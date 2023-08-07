import { CardPageType } from "../models/cardTypeEnum";

export function getPageType(pageName: string): CardPageType {
		pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        // @ts-ignore
        return CardPageType[pageName] || CardPageType.News;
}