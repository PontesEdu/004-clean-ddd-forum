import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMamoryQuestionsAttachmentRepository } from 'test/repositories/in-mamory-questions-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

describe('Edit question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryQuestionAttachmentRepository: InMamoryQuestionsAttachmentRepository
  let sut: EditQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionAttachmentRepository =
      new InMamoryQuestionsAttachmentRepository()
    inMamoryQuestionRepository = new InMamoryQuestionsRepository(
      inMamoryQuestionAttachmentRepository,
    )
    sut = new EditQuestionUseCase(
      inMamoryQuestionRepository,
      inMamoryQuestionAttachmentRepository,
    )
  })

  test('Should be able to Edit question', async () => {
    // create Question
    const question = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    inMamoryQuestionRepository.create(question)

    // create attachment diretamente
    inMamoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      questionId: question.id.toValue(),
      authorId: 'author-1',
      title: 'nova question',
      content: 'quetion nova edit',
      attachmentsIds: ['1', '3'],
    })

    // dois testes iguais :)
    expect(inMamoryQuestionRepository.items[0]).toMatchObject({
      title: 'nova question',
      content: 'quetion nova edit',
    })
    expect(inMamoryQuestionRepository.items[0].title).toEqual('nova question')

    expect(
      inMamoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(
      inMamoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  test('Should not be able to edit question from another user', async () => {
    // create Question
    const question = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    inMamoryQuestionRepository.create(question)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      title: 'nova question',
      content: 'quetion nova edit',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
