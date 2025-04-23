import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/resourse-not-allowed-error'

describe('read Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase // USE CASE => sut

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  test('Should be able to create notifications', async () => {
    const notification = makeNotification(
      {},
      new UniqueEntityId('notification-1'),
    )
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: 'notification-1',
    })

    expect(result.isLeft()).toBe(false)

    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )

    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0]).toEqual(
        result.value?.notification,
      )
    }
  })

  test('Should be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
