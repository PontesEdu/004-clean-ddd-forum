import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

describe('Edit answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let inMamoryAnswerAttachmentRepository: InMamoryAnswersAttachmentRepository
  let sut: EditAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()
    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(
      inMamoryAnswerRepository,
      inMamoryAnswerAttachmentRepository,
    )
  })

  test('Should be able to Edit answer', async () => {
    // create Answer
    const answer = makeAnswer({}, new UniqueEntityId('answer-1'))
    inMamoryAnswerRepository.create(answer)

    // create attachment diretamente
    inMamoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: 'answer-1',
      content: 'answer nova edit',
      attachmentsIds: ['1', '3'],
    })

    expect(inMamoryAnswerRepository.items[0]).toMatchObject({
      content: 'answer nova edit',
    })

    expect(
      inMamoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(inMamoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  test('Should not be able to edita answer from another user', async () => {
    // create Answer
    const answer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )
    inMamoryAnswerRepository.create(answer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'answer nova edit',
      attachmentsIds: [],
    })

    expect(result.value).toBeInstanceOf(Error)
    expect(result.isLeft()).toBe(true)
  })
})
