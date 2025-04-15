import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentRepository } from '../repositories/questions-comments-repository'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(
        questionId,
        { page }, // page: page
      )

    return right({
      questionComments,
    })
  }
}
