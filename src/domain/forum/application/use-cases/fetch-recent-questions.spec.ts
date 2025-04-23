import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMamoryQuestionsAttachmentRepository } from 'test/repositories/in-mamory-questions-attachment-repository'

describe('Fetch Recent Questions', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryQuestionAttachmentRepository: InMamoryQuestionsAttachmentRepository
  let sut: FetchRecentQuestionsUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionAttachmentRepository =
      new InMamoryQuestionsAttachmentRepository()
    inMamoryQuestionRepository = new InMamoryQuestionsRepository(
      inMamoryQuestionAttachmentRepository,
    )
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

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
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

    const result = await sut.execute({ page: 2 })

    // ele vai pular os 20 primeiros items e mostrar so os 2 dos 22 items
    expect(result.value?.questions).toHaveLength(2)
  })
})
