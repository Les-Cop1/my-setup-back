export const handleMongoDBErrors = (error: any) => {
  let handledError

  if (error.message) {
    throw new Error(error.message)
  }

  switch (error.code) {
    case 11000:
      handledError = `Data already exists`
      break
    default:
      console.error(`Unknown error (${error.code})`, error)
      handledError = `Unknown error`
  }

  throw new Error(handledError)
}
