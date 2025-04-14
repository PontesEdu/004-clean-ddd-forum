import { InMamoryAnswersCommentRepository } from 'test/repositories/in-mamory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Dlete Answer Comment', () => {
  let inMamoryAnswersCommentRepository: InMamoryAnswersCommentRepository
  let sut: DeleteAnswerCommentUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswersCommentRepository = new InMamoryAnswersCommentRepository()

    sut = new DeleteAnswerCommentUseCase(inMamoryAnswersCommentRepository)
  })

  test('Should be able to delete a answer commnet', async () => {
    // create Answer
    const answerComment = makeAnswerComment()
    await inMamoryAnswersCommentRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMamoryAnswersCommentRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete another user answer comment', async () => {
    // create Answer
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMamoryAnswersCommentRepository.create(answerComment)

    expect(() => {
      return sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)

    expect(inMamoryAnswersCommentRepository.items).toHaveLength(1)
  })
})
