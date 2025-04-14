import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repository'

interface FetchRecentAnswerUseCaseRequest {
  questionId: string
  page: number
}

interface FetchRecentAnswerUseCaseResponse {
  answers: Answer[]
}

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

    return {
      answers,
    }
  }
}
