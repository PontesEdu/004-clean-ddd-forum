import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answer-repository'
import { Answer } from '../../enterprise/entities/answer'

const fakeAnswerRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    console.log(answer)
  },
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerRepository)

  const answer = await answerQuestion.execute({
    questionId: '1',
    instructorId: '2',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})
