import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/resourse-not-allowed-error'

describe('Delete answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let sut: DeleteAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerRepository = new InMamoryAnswerRepository()
    sut = new DeleteAnswerUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to Delete answer', async () => {
    // create Answer
    const newAnswer = makeAnswer({}, new UniqueEntityId('answer-1'))
    inMamoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: newAnswer.authorId.toString(),
    }) // ou newQuetion.id.toValue()

    expect(inMamoryAnswerRepository.items).toHaveLength(0)
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
