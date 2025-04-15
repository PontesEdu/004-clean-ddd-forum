import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswersRepository } from '../repositories/answer-repository'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resourse-not-found-error'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    // vai pegar um id de alguma answer e procurar com findById se existe essa answer
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityId(answerId),
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
