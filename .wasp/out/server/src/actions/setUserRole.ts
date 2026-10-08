import { prisma } from 'wasp/server'

import { setUserRole } from '../../../../../src/modules/payments/actions'


export default async function (args, context) {
  return (setUserRole as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
    },
  })
}
