import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/questions-repository'

interface CreateQuestionUsecaseRequest {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUsecaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUsecaseRequest): Promise<CreateQuestionUsecaseResponse> {
    const question = Question.create({
      title,
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.questionRepository.create(question)

    return {
      question,
    }
  }
}
