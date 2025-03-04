import apiClient from "./apiClient";
import {IComment} from "../interfaces/comment"

export const getComments = (postId: string) => {
    return new Promise<IComment>((resolve, reject) => {
        apiClient.get(`/comments/post/${postId}`).then((response)=> {
            console.log(response)
            resolve(response.data)
        }).catch((error)=>{
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
        }).catch((error)=>{
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
        }).catch((error)=>{
            console.log(error)
            reject(error)
        })
    })
}