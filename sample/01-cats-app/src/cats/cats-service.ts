import { injectable } from 'galeh/decorators';
import { CatsServiceInterface } from './cats-service-interface';
import { CatModel } from './cat-model';

@injectable()
export class CatsService implements CatsServiceInterface {

  cats: CatModel[] = [
    { name: 'Tom' },
    { name: 'Tom2' },
  ];

  async findOne(id: number): Promise<CatModel> {
    const res = this.cats.at(id) as CatModel;
    return Promise.resolve(res);
  }

  async findAll(): Promise<CatModel[]> {
    return Promise.resolve(this.cats);
  }

  async add(name: string): Promise<void> {
    this.cats.push({
      name
    });
  }
}
