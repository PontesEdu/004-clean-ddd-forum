import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMamoryAnswersAttachmentRepository } from 'test/repositories/in-mamory-answer-attachment-repository'
import { InMamoryAnswerRepository } from 'test/repositories/in-mamory-answer'

let inMamoryAnswersAttachmentRepository: InMamoryAnswersAttachmentRepository
let inMamoryAnswerRepository: InMamoryAnswerRepository

describe('on Answer Created', () => {
  beforeEach(() => {
    inMamoryAnswersAttachmentRepository =
      new InMamoryAnswersAttachmentRepository()

    inMamoryAnswerRepository = new InMamoryAnswerRepository(
      inMamoryAnswersAttachmentRepository,
    )
  })

  it('should send a notification when an answer is created', () => {
    const onAnswerCreated = new OnAnswerCreated()

    const answer = makeAnswer()

    inMamoryAnswerRepository.create(answer)
  })
})
