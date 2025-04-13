import { AnswersRepository } from '../repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    content,
    answerId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    // so os que tem Setters
    answer.content = content

    await this.answerRepository.save(answer)

    return {
      answer,
    }
  }
}
