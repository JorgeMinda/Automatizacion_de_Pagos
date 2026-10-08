import { prisma } from 'wasp/server'

import { registerStudentForParent } from '../../../src/modules/payments/actions'


export default async function (args, context) {
  return (registerStudentForParent as any)(args, {
    ...context,
    entities: {
      Student: prisma.student,
      StudentAllergy: prisma.studentAllergy,
    },
  })
}
