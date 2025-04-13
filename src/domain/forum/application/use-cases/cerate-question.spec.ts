import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { CreateQuestionUseCase } from './create-question'

describe('Create Question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: CreateQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to cerate question', async () => {
    const { question } = await sut.execute({
      authorId: 'Eduardo',
      title: 'Nova Pergunta',
      content: 'conteudo da pergunta',
    })

    expect(question.id).toBeTruthy()
  })
})
