import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMamoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  async findBySlug(slug: string) {
    const slugQuestion = this.items.find((items) => items.slug.value === slug)

    if (!slugQuestion) {
      return null
    }

    return slugQuestion
  }

  async create(question: Question) {
    this.items.push(question)
  }
}
