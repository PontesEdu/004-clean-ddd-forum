import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { CreateGetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

describe('Get Question By Slug', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: CreateGetQuestionBySlugUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new CreateGetQuestionBySlugUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({ slug: Slug.create('example-question') })

    inMamoryQuestionRepository.create(newQuestion)

    const { question } = await sut.execute({ slug: 'example-question' })

    expect(question.id).toBeTruthy()
    expect(question.title).toEqual(newQuestion.title)
  })
})
