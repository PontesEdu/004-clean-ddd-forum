import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', async () => {
  const result = doSomething(true)

  if (result.isRight()) {
    console.log(result.value)
  }

  expect(result.value).toEqual(10)
})

test('Error result', async () => {
  const result = doSomething(false)

  if (result.isRight()) {
    console.log(result.value)
  }

  expect(result.value).toEqual('error')
})
