import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/questions-repository'

interface QuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface QuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: QuestionUseCaseRequest): Promise<QuestionUseCaseResponse> {
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
