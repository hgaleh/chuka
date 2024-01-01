export interface CatModel {
    name: string;
    country?: {
        name: string;
        numberOfCatSpecies: number;
    }
    age?: number;
    parents?: Array<CatModel>;
}