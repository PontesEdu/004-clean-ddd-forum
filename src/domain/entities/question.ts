import { randomUUID } from "node:crypto"
import { Slug } from "./value-objects/slug"

interface QuestionProps {
  title: string
  content: string
  authorId: string
  slug: Slug
}

export class Question {
  public title: string
  public content: string
  public slug: Slug
  public id: string
  public authorId: string

  constructor (prosp: QuestionProps, id?: string){
    this.title = prosp.title
    this.content = prosp.content
    this.authorId = prosp.authorId
    this.slug = prosp.slug
    this.id = id ?? randomUUID()

  }
}