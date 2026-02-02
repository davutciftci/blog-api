import { Request, Response } from "express";
import { createComment, deleteComment, getCommentsByPost } from "../services/comment";

interface createCommentType {
    postId: string;
    content: string;
}

interface deleteCommentType {
    id: string;
}
export const create = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params as unknown as createCommentType;
        const { content } = req.body as createCommentType;

        if(!content || content.trim().length < 2) {
            return res.status(400).json({
                error: 'Comment must be at least 2 characters long'
            })
        }

        const comment = await createComment(postId, req.user.id, content)
        res.status(201).json({ message: 'Comment created successfully', comment })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params as unknown as createCommentType;

        const comments = await getCommentsByPost(postId)
        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as unknown as deleteCommentType;

        const result = await deleteComment(id, req.user.id)

        res.status(200).json({ message: 'Comment deleted successfully', result })
    } catch (error:string | any) {
        if(error.message === 'Comment not found') {
            return res.status(404).json({ error: error.message })
        }
        if(error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}