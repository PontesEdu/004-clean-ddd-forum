import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMamoryQuestionsCommentRepository } from 'test/repositories/in-mamory-question-comment-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

describe('Question Comment', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryQuestionsCommentRepository: InMamoryQuestionsCommentRepository
  let sut: CommentOnQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    inMamoryQuestionsCommentRepository =
      new InMamoryQuestionsCommentRepository()

    sut = new CommentOnQuestionUseCase(
      inMamoryQuestionRepository,
      inMamoryQuestionsCommentRepository,
    )
  })

  test('Should be able to Choose best Answer', async () => {
    // create Question
    const question = makeQuestion()
    await inMamoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'comentario test',
    })

    expect(inMamoryQuestionsCommentRepository.items[0].content).toEqual(
      'comentario test',
    )
  })
})
