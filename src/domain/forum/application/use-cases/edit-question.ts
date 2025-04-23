import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resourse-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/resourse-not-allowed-error'
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    authorId,
    title,
    content,
    questionId,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    // vai procurar no banco attachments com o mesmo questionId
    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    // vai criar uma variavel com dados que vir no banco
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    // esta editando com a var que pegou do banco de dados com o novo attachment que criou acima
    questionAttachmentList.update(questionAttachments)

    // so os que tem Setters
    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
