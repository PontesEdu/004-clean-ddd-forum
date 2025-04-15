import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answer-repository'
import { QuestionRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/resourse-not-allowed-error'
import { ResourceNotFoundError } from './errors/resourse-not-found-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { question: Question }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new NotAllowedError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    // esta verificando o author id da questao e o mesmo author que passou la aqui no use case
    // question === question
    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
