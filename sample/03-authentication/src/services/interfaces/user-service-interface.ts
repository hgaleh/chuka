import { UserModel } from "models/user-model";

export interface UserServiceInterface {
    getUserById(id: number): Promise<Omit<UserModel, 'password'>>;
    getUserByEmail(email: string): Promise<UserModel | null>;
    build(userDto: Omit<UserModel, 'id'>): any;
}