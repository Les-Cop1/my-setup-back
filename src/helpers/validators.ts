import { ICreateFileInput, ResponseType } from '@types'

export const passwordValidators = (password: string) => [
  {
    validator: password !== undefined,
    message: 'Password is required',
  },
  {
    validator: password?.length >= 8,
    message: 'Password must be at least 8 characters long',
  },
  {
    validator: /[a-z]/g.test(password),
    message: 'Password must contain at least one lowercase letter',
  },
  {
    validator: /[A-Z]/g.test(password),
    message: 'Password must contain at least one uppercase letter',
  },
  {
    validator: /[0-9]/g.test(password),
    message: 'Password must contain at least one number',
  },
  {
    validator: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g.test(password),
    message: 'Password must contain at least one special character',
  },
]

export const confirmationValidators = (password: string, confirmation: string) => [
  {
    validator: confirmation !== undefined,
    message: 'Confirmation is required',
  },
  {
    validator: confirmation === password,
    message: 'Confirmation must be the same as the password',
  },
]

export const invoiceFileFilter = (file: ICreateFileInput) => {
  let response: ResponseType = {
    success: true,
  }

  const authorizedFileType = ['application/pdf', 'image/png', 'image/jpeg']

  if (!authorizedFileType.includes(file.mimetype)) {
    response = {
      ...response,
      success: false,
      error: 'The file is not in the correct format',
    }
  }

  return response
}
