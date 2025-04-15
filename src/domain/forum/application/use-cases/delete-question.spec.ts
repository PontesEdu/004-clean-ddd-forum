import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Delete question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: DeleteQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to Delete question', async () => {
    // create Question
    const newQuestion = makeQuestion({}, new UniqueEntityId('question-1'))
    inMamoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: newQuestion.authorId.toString(),
    }) // ou newQuetion.id.toValue()

    expect(inMamoryQuestionRepository.items).toHaveLength(0)
  })

  test('Should not be able to deletea question from another user', async () => {
    // create Question
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    inMamoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.value).toBeInstanceOf(Error)
    expect(result.isLeft()).toBe(true)
  })
})
