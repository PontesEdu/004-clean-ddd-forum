import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMamoryQuestionsAttachmentRepository } from './../../../../../test/repositories/in-mamory-questions-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

describe('Delete question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryQuestionAttachmentRepository: InMamoryQuestionsAttachmentRepository
  let sut: DeleteQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionAttachmentRepository =
      new InMamoryQuestionsAttachmentRepository()
    inMamoryQuestionRepository = new InMamoryQuestionsRepository(
      inMamoryQuestionAttachmentRepository,
    )
    sut = new DeleteQuestionUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to delete question', async () => {
    // create Question
    const newQuestion = makeQuestion({}, new UniqueEntityId('question-1'))
    inMamoryQuestionRepository.create(newQuestion)

    // create attachment diretamente
    inMamoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: newQuestion.authorId.toString(),
    }) // ou newQuetion.id.toValue()

    expect(inMamoryQuestionRepository.items).toHaveLength(0)
    expect(inMamoryQuestionAttachmentRepository.items).toHaveLength(0)
  })

  test('Should not be able to deletea question from another user', async () => {
    // create Question
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    inMamoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.value).toBeInstanceOf(Error)
    expect(result.isLeft()).toBe(true)
  })
})
