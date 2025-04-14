import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentUseCase } from './fetch-question-comment'
import { InMamoryQuestionsCommentRepository } from 'test/repositories/in-mamory-question-comment-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

describe('Fetch Question Comments', () => {
  let inMamoryCommentRepository: InMamoryQuestionsCommentRepository
  let sut: FetchQuestionCommentUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryCommentRepository = new InMamoryQuestionsCommentRepository()
    sut = new FetchQuestionCommentUseCase(inMamoryCommentRepository)
  })

  test('Should be able to Fetch Question Comments', async () => {
    await inMamoryCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMamoryCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMamoryCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )

    const { questionComments } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(questionComments).toHaveLength(3)
  })

  test('Should be able to Fetch Pagination question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMamoryCommentRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    // .slice((page - 1) * 20, page * 20)

    const { questionComments } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    // ele vai pular os 20 primeiros items e mostrar so os 2 dos 22 items
    expect(questionComments).toHaveLength(2)
  })
})
