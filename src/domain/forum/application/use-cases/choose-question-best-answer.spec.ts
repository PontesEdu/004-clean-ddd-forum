import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/resourse-not-allowed-error'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'
import { InMamoryQuestionsAttachmentRepository } from 'test/repositories/in-mamory-questions-attachment-repository'

describe('Choose Question Best Answer', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let inMamoryAnswerAttachmentRepository: InMamoryAnswersAttachmentRepository
  let inMamoryQuestionAttachmentRepository: InMamoryQuestionsAttachmentRepository
  let sut: ChooseQuestionBestAnswerUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionAttachmentRepository =
      new InMamoryQuestionsAttachmentRepository()
    inMamoryQuestionRepository = new InMamoryQuestionsRepository(
      inMamoryQuestionAttachmentRepository,
    )

    inMamoryAnswerAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()
    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswerAttachmentRepository,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMamoryAnswerRepository,
      inMamoryQuestionRepository,
    )
  })

  test('Should be able to Choose best Answer', async () => {
    // create Question and Answer
    const question = makeQuestion()
    await inMamoryQuestionRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await inMamoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMamoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  test('Should not be able to choose another user question best answer', async () => {
    // create Question and Answer
    const question = makeQuestion({ authorId: new UniqueEntityId('author-1') })
    await inMamoryQuestionRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await inMamoryAnswerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
