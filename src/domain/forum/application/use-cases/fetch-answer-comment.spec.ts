import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment'
import { InMamoryAnswersCommentRepository } from 'test/repositories/in-mamory-answer-comment-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

describe('Fetch Answer Comments', () => {
  let inMamoryCommentRepository: InMamoryAnswersCommentRepository
  let sut: FetchAnswerCommentUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryCommentRepository = new InMamoryAnswersCommentRepository()
    sut = new FetchAnswerCommentUseCase(inMamoryCommentRepository)
  })

  test('Should be able to Fetch Answer Comments', async () => {
    await inMamoryCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )
    await inMamoryCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )
    await inMamoryCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  test('Should be able to Fetch Pagination answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMamoryCommentRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      )
    }

    // .slice((page - 1) * 20, page * 20)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    // ele vai pular os 20 primeiros items e mostrar so os 2 dos 22 items
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
