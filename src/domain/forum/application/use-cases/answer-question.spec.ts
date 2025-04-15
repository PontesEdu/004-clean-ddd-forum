import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { AnswerQuestionUseCase } from './answer-question'

describe('Create Answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let sut: AnswerQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerRepository = new InMamoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to create Answer', async () => {
    const result = await sut.execute({
      instructorId: 'Clovis',
      questionId: 'Nova Questao',
      content: 'conteudo da pergunta',
    })

    if (result.isRight()) {
      const answer = result.value.answer

      expect(answer.id).toBeTruthy()
      expect(answer.content).toEqual('conteudo da pergunta')
    }
  })
})
