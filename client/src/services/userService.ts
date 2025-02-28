import apiClient from "./apiClient";
import {IUser} from "../interfaces/user"
import { IFormData as ILogin } from '../interfaces/signInForm';
import { IFormData as IRegister} from '../interfaces/signInForm';

export const loginUser = (data: ILogin) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("login user")
        console.log(data)
        apiClient.post("/auth/login", data).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error)=>{
            console.log(error)
            reject(error)
        })
    })
}

export const registerUser = (data: IRegister) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("regitering user")
        apiClient.post("/auth/register", data).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error)=>{
            console.log(error)
            reject(error)
        })
    })
}