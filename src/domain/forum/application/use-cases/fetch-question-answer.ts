import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repository'

interface FetchRecentAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchRecentAnswerUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchRecentAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchRecentAnswerUseCaseRequest): Promise<FetchRecentAnswerUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }, // page: page
    )

    return right({
      answers,
    })
  }
}
