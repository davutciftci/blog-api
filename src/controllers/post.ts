import {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost
} from '../services/post.js';
import { Request, Response } from 'express';

interface updatePostRequest {
    id?: string;
    title?: string;
    content?: string;
    published?: boolean;
}

export const create = async (req: Request, res: Response) => {
  try {
    const { title, content, published } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        error: 'Title must be at least 3 characters'
      });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({
        error: 'Content must be at least 10 characters'
      });
    }

    const post = await createPost(req.user.id, {
      title,
      content,
      published: published || false
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', published } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        error: 'Invalid pagination parameters'
      });
    }
    
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const options: any = { skip, take };
    
    if (published !== undefined) {
      options.published = published === 'true';
    }

    const posts = await getAllPosts(options);

    res.status(200).json({
      posts,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: posts.length
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = id as string;

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idStr)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const post = await getPostById(id as string);

    res.status(200).json({ post });

  } catch (error) {
    if (error instanceof Error && error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const update = async (req:Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const updateData: updatePostRequest = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const post = await updatePost(id as string, req.user.id, updateData);

    res.status(200).json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete post
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await deletePost(id as string, req.user.id);

    res.status(200).json(result);

  } catch (error) {
    if (error instanceof Error && error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};