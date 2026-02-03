import { Request, Response } from "express";
import { createComment, deleteComment, getCommentsByPost, updateComment } from "../services/comment";

export const create = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if(!content || content.trim().length < 2) {
            return res.status(400).json({
                error: 'Comment must be at least 2 characters long'
            })
        }
        if (typeof postId !== 'string') {
            return res.status(400).json({ error: 'Invalid postId' });
        }
        const comment = await createComment(postId, req.user.id, content)
        res.status(201).json({ message: 'Comment created successfully', comment })
    } catch (error: any) {
        if(error.message === 'Post not found') {
            return res.status(404).json({ error: error.message })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        if (typeof postId !== 'string') {
            return res.status(400).json({ error: 'Invalid postId' });
        }
        const comments = await getCommentsByPost(postId)
        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id' });
        }
        const result = await deleteComment(id, req.user.id)

        res.status(200).json({ message: 'Comment deleted successfully', result })
    } catch (error: any) {
        if(error.message === 'Comment not found') {
            return res.status(404).json({ error: error.message })
        }
        if(error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if(!content || content.trim().length < 2) {
            return res.status(400).json({
                error: 'Comment must be at least 2 characters long'
            })
        }

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id' });
        }
        const comment = await updateComment(id, req.user.id, content)
        res.status(200).json({ message: 'Comment updated successfully', comment })
    } catch (error: any) {
        if(error.message === 'Comment not found') {
            return res.status(404).json({ error: error.message })
        }
        if(error.message.includes('Unauthorized')) {
            return res.status(403).json({ error: error.message })
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}