import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

describe('send Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase // USE CASE => sut

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  test('Should be able to create notifications', async () => {
    const result = await sut.execute({
      recipientId: 'Eduardo',
      title: 'Nova Pergunta',
      content: 'conteudo da pergunta',
    })

    expect(result.isLeft()).toBe(false)

    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
