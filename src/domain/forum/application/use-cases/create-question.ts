import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUsecaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
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
    attachmentsIds,
  }: CreateQuestionUsecaseRequest): Promise<CreateQuestionUsecaseResponse> {
    const question = Question.create({
      title,
      authorId: new UniqueEntityId(authorId),
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    return right({
      question,
    })
  }
}
