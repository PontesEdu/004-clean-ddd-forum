import { randomUUID } from "node:crypto"

interface AnswerProps {
  questionId: string
  content: string
  authorId: string
}

export class Answer {
  public content: string
  public id: string
  public authorId: string
  public questionId: string

  constructor (prosp: AnswerProps, id?: string){
    this.content = prosp.content
    this.id = id ?? randomUUID()
    this.questionId = prosp.questionId
    this.authorId = prosp.authorId
  }
}