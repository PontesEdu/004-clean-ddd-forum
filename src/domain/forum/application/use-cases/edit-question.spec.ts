import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Edit question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: EditQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to Edit question', async () => {
    // create Question
    const question = makeQuestion({}, new UniqueEntityId('question-1'))
    inMamoryQuestionRepository.create(question)

    await sut.execute({
      questionId: 'question-1',
      authorId: question.authorId.toString(),
      title: 'nova question',
      content: 'quetion nova edit',
    })

    expect(question.title).toEqual('nova question')
  })

  test('Should not be able to edita question from another user', async () => {
    // create Question
    const question = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    inMamoryQuestionRepository.create(question)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      title: 'nova question',
      content: 'quetion nova edit',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
