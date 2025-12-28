export interface CatModel {
    name: string;
    country?: string;
    age?: number;
    parents?: Array<CatModel>;
}