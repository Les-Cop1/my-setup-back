import { handleMongoDBErrors } from '@helpers'
import { CategoryModel } from '@models'
import { ResponseType } from '@types'

export const getCategories = async () => {
  let response: ResponseType = {
    success: true,
  }

  try {
    const data = await CategoryModel.find().sort('name').exec()
    const categories = data.map((category) => category?.name)

    response = { ...response, data: { categories } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

module.exports = {
  getCategories,
}
