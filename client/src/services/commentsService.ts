import apiClient from "./apiClient";
import {IComment} from "../interfaces/comment"
import { AxiosError } from "axios";

export const getComments = (postId: string) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.get(`/comments/post/${postId}`).then((response)=> {
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            reject(error)
        })
    })
}

export const createComment = (comment: IComment) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.post('/comments/', comment).then((response)=> {
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            if(error.response?.status === 401) {
                reject("You are not authorized to create a comment")
            } else{
                reject("Failed to create comment. Please try again.") 
            }
        })
    })
}

export const deleteComment = (commentId: string) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.delete(`/comments/${commentId}`).then((response)=> {
            resolve(response.data)
        }).catch((error: AxiosError)=>{
            if(error.response?.status === 401) {
                reject("You are not authorized to delete this comment")
            } else{
                reject("Failed to delete comment. Please try again.") 
            }
        })
    })
}