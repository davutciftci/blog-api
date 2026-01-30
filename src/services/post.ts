import prisma from '../config/database'
import {slugify} from '../utils/formatters'

interface CreatePostData {
    title: string
    content: string
    published?: boolean
    slug?: string
}

interface UpdatePostData {
    title?: string;
    content?: string;
    published?: boolean;
    slug?: string;
}

export const createPost = async (authorId: string, postData: CreatePostData) => {
    const { title, content, published = false} = postData;

    const slug = slugify(title);

    const existingPost = await prisma.post.findUnique({
        where: { slug}
    });
    
    if(existingPost) {
        const uniqueSlug = `${slug}-${Date.now()}`;
        postData.slug = uniqueSlug;
    } else {
        postData.slug = slug
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            slug: postData.slug,
            published,
            authorId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return post;
}

export const getPostById = async (id: string) => {
    const post = await prisma.post.findUnique({
        where: { id},
        include : {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        comments : {
            include : {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }
    })

    if(!post) {
        throw new Error('Post not found')
    }
    return post;
};

export const getPostBySlug = async (slug: string) => {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    if(!post) {
        throw new Error ('post not found')
    }
    return post;
};

interface GetAllPostsOptions {
    skip?: number;
    take?: number;
    published?: boolean;
    authorId?: string;
}

export const getAllPosts = async (options: GetAllPostsOptions = {}) => {
    const { skip = 0, take = 10, published, authorId} = options;

    const where: any = {};

    if(published !== undefined) {
        where.published = published;
    }

    if(authorId) {
        where.authorId = authorId;
    }

    const posts = await prisma.post.findMany({
        where,
        skip,
        take,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        _count: {
            select: {
                comments: true
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return posts;
};

export const updatePost = async (id: string, authorId: string, updateData: UpdatePostData) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== authorId) {
    throw new Error('Unauthorized to update this post');
  }

  if (updateData.title) {
    updateData.slug = slugify(updateData.title);
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return updatedPost;
};

export const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== authorId) {
    throw new Error('Unauthorized to delete this post');
  }

  await prisma.post.delete({ where: { id } });

  return { message: 'Post deleted successfully', id };
};

export const getPostsByAuthor = async (authorId: string, options: GetAllPostsOptions = {}) => {
  return getAllPosts({ ...options, authorId });
};