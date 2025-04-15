import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { NotAllowedError } from './errors/resourse-not-allowed-error'
import { ResourceNotFoundError } from './errors/resourse-not-found-error'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    content,
    answerId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    // so os que tem Setters
    answer.content = content

    await this.answerRepository.save(answer)

    return right({
      answer,
    })
  }
}
