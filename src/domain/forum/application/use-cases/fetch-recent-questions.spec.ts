import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

describe('Fetch Recent Questions', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: FetchRecentQuestionsUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to Fetch recent Questions', async () => {
    await inMamoryQuestionRepository.create(
      makeQuestion({ createAt: new Date(2022, 2, 20) }),
    )
    await inMamoryQuestionRepository.create(
      makeQuestion({ createAt: new Date(2023, 0, 10) }),
    )
    await inMamoryQuestionRepository.create(
      makeQuestion({ createAt: new Date(2025, 0, 30) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createAt: new Date(2025, 0, 30) }),
      expect.objectContaining({ createAt: new Date(2023, 0, 10) }),
      expect.objectContaining({ createAt: new Date(2022, 2, 20) }),
    ])
  })

  test('Should be able to Fetch Pagination recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMamoryQuestionRepository.create(makeQuestion())
    }

    // .slice((page - 1) * 20, page * 20)

    const { questions } = await sut.execute({ page: 2 })

    // ele vai pular os 20 primeiros items e mostrar so os 2 dos 22 items
    expect(questions).toHaveLength(2)
  })
})
