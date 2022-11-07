import { handleMongoDBErrors } from '@helpers'
import { CategoryModel } from '@models'
import { ResponseType } from '@types'

export const getCategories = async () => {
  let response: ResponseType = {
    success: true,
  }

  try {
    const categories = await CategoryModel.find().sort('name').exec()

    response = { ...response, data: { categories } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}
