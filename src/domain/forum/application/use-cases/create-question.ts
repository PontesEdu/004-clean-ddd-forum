import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'

interface CreateQuestionUsecaseRequest {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUsecaseResponse = Either<
  null,
  {
    question: Question
  }
>

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

    return right({
      question,
    })
  }
}
