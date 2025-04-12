import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

interface QuestionProps {
  title: string
  bestAnswerId?: UniqueEntityId
  content: string
  authorId: UniqueEntityId
  slug: Slug
  createAt: Date
  updateAt?: Date
}

export class Question extends Entity<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createAt' | 'slug'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createAt: new Date(),
      },
      id,
    )

    return question
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }

  get createAt() {
    return this.props.createAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  /**
   *
   * vai fazer a diferencia de dias do createAt para a data Atual para ver se ja faz tempo a pegunta
   * ta verificando e ela e menor ou igual a 3
   */
  get isNew(): boolean {
    return dayjs().diff(this.createAt, 'days') <= 3
  }
}
