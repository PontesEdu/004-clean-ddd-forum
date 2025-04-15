import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerProps {
  content: string
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  createAt: Date
  updateAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createAt() {
    return this.props.createAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  static create(props: Optional<AnswerProps, 'createAt'>, id?: UniqueEntityId) {
    const answer = new Answer(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
      },
      id,
    )

    return answer
  }
}
