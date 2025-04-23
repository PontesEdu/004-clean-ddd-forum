import { makeAnswer } from 'test/factories/make-answer'
import { InMamoryAnswersCommentRepository } from 'test/repositories/in-mamory-answer-comment-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'

describe('Answer Comment', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let inMamoryAnswersCommentRepository: InMamoryAnswersCommentRepository
  let inMamoryAnswerAttachmentRepository: InMamoryAnswersAttachmentRepository
  let sut: CommentOnAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()

    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswerAttachmentRepository,
    )

    inMamoryAnswersCommentRepository = new InMamoryAnswersCommentRepository()

    sut = new CommentOnAnswerUseCase(
      inMamoryAnswerRepository,
      inMamoryAnswersCommentRepository,
    )
  })

  test('Should be able to Choose best Answer', async () => {
    // create Answer
    const answer = makeAnswer()
    await inMamoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'comentario test',
    })

    expect(inMamoryAnswersCommentRepository.items[0].content).toEqual(
      'comentario test',
    )
  })
})
