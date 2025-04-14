import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMamoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createAt.getTime() - a.createAt.getTime())
      .slice((page - 1) * 20, page * 20)
    // o slice(start, end) então se o page for 2 ele começa do 20 e termina no 40

    return questions
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

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

  async delete(question: Question): Promise<void> {
    const ItemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(ItemIndex, 1) // 1 params = ele procura a posição no array, 2 params = quantos quer deletar
  }
}
