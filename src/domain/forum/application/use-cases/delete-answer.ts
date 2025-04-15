import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answer-repository'
import { ResourceNotFoundError } from './errors/resourse-not-found-error'
import { NotAllowedError } from './errors/resourse-not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right(null)
  }
}
