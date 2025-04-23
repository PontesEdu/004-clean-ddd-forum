import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'

describe('Create Answer', () => {
  let inMamoryAnswerRepository: InMamoryAnswerRepository
  let inMamoryAnswerAttachmentRepository: InMamoryAnswersAttachmentRepository
  let sut: AnswerQuestionUseCase // USE CASE => sut

  beforeEach(() => {
    inMamoryAnswerAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()
    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMamoryAnswerRepository)
  })

  test('Should be able to create Answer', async () => {
    const result = await sut.execute({
      instructorId: 'Clovis',
      questionId: 'Nova Questao',
      content: 'conteudo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    if (result.isRight()) {
      const answer = result.value.answer

      expect(answer.id).toBeTruthy()
      expect(answer.content).toEqual('conteudo da pergunta')
    }

    expect(
      inMamoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(inMamoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
