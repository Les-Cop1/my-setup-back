export const handleMongoDBErrors = (error: any) => {
  let handledError

  console.log(error)

  switch (error.code) {
    case 11000:
      handledError = `Data already exists`
      break
  }

  if (!handledError && error.message) {
    handledError = error.message
  }

  throw new Error(handledError)
}
