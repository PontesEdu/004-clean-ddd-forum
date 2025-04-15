import { InMamoryQuestionsCommentRepository } from 'test/repositories/in-mamory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Dlete Question Comment', () => {
  let inMamoryQuestionsCommentRepository: InMamoryQuestionsCommentRepository
  let sut: DeleteQuestionCommentUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionsCommentRepository =
      new InMamoryQuestionsCommentRepository()

    sut = new DeleteQuestionCommentUseCase(inMamoryQuestionsCommentRepository)
  })

  test('Should be able to delete a question commnet', async () => {
    // create Question
    const questionComment = makeQuestionComment()
    await inMamoryQuestionsCommentRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMamoryQuestionsCommentRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete another user question comment', async () => {
    // create Question
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await inMamoryQuestionsCommentRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
    expect(inMamoryQuestionsCommentRepository.items).toHaveLength(1)
  })
})
