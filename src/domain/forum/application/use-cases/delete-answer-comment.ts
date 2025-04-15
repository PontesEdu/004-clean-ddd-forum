import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { ResourceNotFoundError } from './errors/resourse-not-found-error'
import { NotAllowedError } from './errors/resourse-not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(answerComment)

    return right(null)
  }
}
