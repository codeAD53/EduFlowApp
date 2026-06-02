import {param} from 'express-validator'

export const IdParamRule =  param('id').isInt().withMessage("Id must be a number");