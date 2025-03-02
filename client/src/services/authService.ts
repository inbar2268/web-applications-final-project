import apiClient from "./apiClient";
import {IUser} from "../interfaces/user"
import { IFormData as ILogin } from '../interfaces/signInForm';
import { IFormData as IRegister} from '../interfaces/signInForm';
import { CredentialResponse } from "@react-oauth/google";


export const loginUser = (data: ILogin) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("login user")
        console.log(data)
        apiClient.post("/auth/login", data).then((response)=> {
            console.log(response)
            storeAccessToken(response.data.accessToken)
            storeRefreshToken(response.data.refreshToken)
            storeUserId(response.data._id)
            resolve(response.data);
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

export const googleSignIn = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("google sign in")
        apiClient.post("/auth/google", credentialResponse).then((response)=> {
            storeAccessToken(response.data.accessToken)
            storeRefreshToken(response.data.refreshToken)
            storeUserId(response.data._id)
            resolve(response.data)
        }).catch((error)=>{
            reject(error)
        })
    })
}

export const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userId");
}

const storeAccessToken = (accessToken: string) =>{
    sessionStorage.setItem("accessToken", accessToken);
}

const storeUserId = (userId: string) =>{
    sessionStorage.setItem("userId", userId);
}

const storeRefreshToken = (refreshToken: string) =>{
    sessionStorage.setItem("refreshToken", refreshToken);
}

