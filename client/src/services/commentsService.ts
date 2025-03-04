import apiClient from "./apiClient";
import {IComment} from "../interfaces/comment"
import { AxiosError } from "axios";

export const getComments = (postId: string) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.get(`/comments/post/${postId}`).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            console.log(error)
            reject(error)
        })
    })
}


export const createComment = (comment: IComment) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.post('/comments/', comment).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            console.log(error)
            reject(error)
        })
    })
}

export const deleteComment = (commentId: string) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.delete(`/comments/${commentId}`).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            console.log(error)
            if(error.response?.status === 401) {
                reject("You are not authorized to delete this comment")
            } else{
                reject("Failed to delete comment. Please try again.") 
            }
        })
    })
}