import { Entity } from '../../core/entities/entity'
import { UniqueEntityId } from '../../core/entities/unique-entity-id'
import { Optional } from '../../core/types/optional'

interface AnswerProps {
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

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
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

  static create(props: Optional<AnswerProps, 'createAt'>, id?: UniqueEntityId) {
    const answer = new Answer(
      {
        ...props,
        createAt: new Date(),
      },
      id,
    )

    return answer
  }
}
