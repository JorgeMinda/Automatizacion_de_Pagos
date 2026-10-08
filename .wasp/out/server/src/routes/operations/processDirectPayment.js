import { createAction } from '../../middleware/operations.js'
import processDirectPayment from '../../actions/processDirectPayment.js'

export default createAction(processDirectPayment)
