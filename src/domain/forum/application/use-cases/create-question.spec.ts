import { InMamoryQuestionsRepository } from 'test/repositories/in-mamory-question-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Create Question', () => {
  let inMamoryQuestionRepository: InMamoryQuestionsRepository
  let sut: CreateQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryQuestionRepository = new InMamoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMamoryQuestionRepository)
  })

  test('Should be able to cerate question', async () => {
    const result = await sut.execute({
      authorId: 'Eduardo',
      title: 'Nova Pergunta',
      content: 'conteudo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(false)

    expect(inMamoryQuestionRepository.items[0]).toEqual(result.value?.question)

    expect(
      inMamoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(
      inMamoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
