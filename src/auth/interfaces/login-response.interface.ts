import { User } from "../entities/users.entity";

export interface LoginResponse{
    user  : User;
    token : String;
}