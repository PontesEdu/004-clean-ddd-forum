import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '../../../../core/errors/errors/resourse-not-allowed-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'

describe('Delete answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let inMamoryAnswersAttachmentRepository: InMamoryAnswersAttachmentRepository
  let sut: DeleteAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswersAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()
    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswersAttachmentRepository,
    )
    sut = new DeleteAnswerUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to Delete answer', async () => {
    // create Answer
    const newAnswer = makeAnswer({}, new UniqueEntityId('answer-1'))
    inMamoryAnswerRepository.create(newAnswer)

    // create attachment diretamente
    inMamoryAnswersAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      answerId: 'answer-1',
      authorId: newAnswer.authorId.toString(),
    }) // ou newQuetion.id.toValue()

    expect(inMamoryAnswerRepository.items).toHaveLength(0)
    expect(inMamoryAnswersAttachmentRepository.items).toHaveLength(0)
  })

  test('Should not be able to deletea answer from another user', async () => {
    // create Answer
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )
    inMamoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
