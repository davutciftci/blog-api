import prisma from '../config/database.js';

export const createComment = async (postId: string, authorId: string, content: string) => {
    const post = await prisma.post.findUnique({
        where: { id: postId }
    })

    if(!post) {
        throw new Error('Post not found')
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            authorId,
            postId
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
    return comment
}

export const getCommentsByPost = async (postId: string) => {
    const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return comments
}

export const deleteComment = async (id: string, authorId: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id }
    })

    if(!comment) {
        throw new Error('Comment not found')
    }

    if(comment.authorId !== authorId) {
        throw new Error('Unauthorized to delete this comment')
    }

    await prisma.comment.delete({
        where: { id }
    })
    return { message: 'Comment deleted successfully', id }
}

export const updateComment = async (id: string, authorId: string, content: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id }
    })

    if(!comment) {
        throw new Error('Comment not found')
    }

    if(comment.authorId !== authorId) {
        throw new Error('Unauthorized to update this comment')
    }

    const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
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
    return updatedComment
}
