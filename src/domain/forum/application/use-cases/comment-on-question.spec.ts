import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMamoryQuestionsCommentRepository } from 'test/repositories/in-mamory-question-comment-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMamoryQuestionsAttachmentRepository } from 'test/repositories/in-mamory-questions-attachment-repository'

describe('Question Comment', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryQuestionsCommentRepository: InMamoryQuestionsCommentRepository
  let inMamoryQuestionAttachmentRepository: InMamoryQuestionsAttachmentRepository
  let sut: CommentOnQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionAttachmentRepository =
      new InMamoryQuestionsAttachmentRepository()
    inMamoryQuestionRepository = new InMamoryQuestionsRepository(
      inMamoryQuestionAttachmentRepository,
    )

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
