import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'

describe('Edit answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let sut: EditAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerRepository = new InMamoryAnswerRepository()
    sut = new EditAnswerUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to Edit answer', async () => {
    // create Answer
    const answer = makeAnswer({}, new UniqueEntityId('answer-1'))
    inMamoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: 'answer-1',
      authorId: answer.authorId.toString(),
      content: 'answer nova edit',
    })

    expect(inMamoryAnswerRepository.items[0]).toMatchObject({
      content: 'answer nova edit',
    })
  })

  test('Should not be able to edita answer from another user', async () => {
    // create Answer
    const answer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )
    inMamoryAnswerRepository.create(answer)

    expect(() => {
      return sut.execute({
        answerId: 'answer-1',
        authorId: 'author-2',
        content: 'answer nova edit',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
