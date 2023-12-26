import { injectable } from 'inversify';
import { CatModel } from './cat-model';

export interface CatsServiceInterface {
  findAll(): Promise<CatModel[]>;
  findOne(id: number): Promise<CatModel>;
  add(name: string): Promise<void>;
}
