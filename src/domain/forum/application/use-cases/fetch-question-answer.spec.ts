import { makeAnswer } from 'test/factories/make-answer'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { FetchRecentAnswerUseCase } from './fetch-question-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Fetch Recent Answers', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let sut: FetchRecentAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerRepository = new InMamoryAnswerRepository()
    sut = new FetchRecentAnswerUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to Fetch recent Answers', async () => {
    await inMamoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMamoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMamoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )

    const { answers } = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(answers).toHaveLength(3)
  })

  test('Should be able to Fetch Pagination recent answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMamoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    // .slice((page - 1) * 20, page * 20)

    const { answers } = await sut.execute({ questionId: 'question-1', page: 2 })

    // ele vai pular os 20 primeiros items e mostrar so os 2 dos 22 items
    expect(answers).toHaveLength(2)
  })
})
