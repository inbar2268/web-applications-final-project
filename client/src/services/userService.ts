import apiClient from "./apiClient";
import {IUser} from "../interfaces/user"
import { IFormData} from '../interfaces/signInForm'

export const loginUser = (data: IFormData) => {
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

export const registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("regitering user")
        apiClient.post("/auth/register", user).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error)=>{
            console.log(error)
            reject(error)
        })
    })
}