import { UserModel } from "models/user-model"
import { Token } from "types/token"

export interface AuthServiceInterface {
    getTokenFromEmailAndPassword(email: string, password: string): Promise<Token>
    registerUser(name: string, email: string, password: string): Promise<Omit<UserModel, 'password'>>
}