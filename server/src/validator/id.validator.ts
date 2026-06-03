import {param} from 'express-validator'

export const idParamRule = (name = 'id') => 
        param(name).isInt({min: 1}).withMessage(`${name} must be a number`).toInt();

export const IdParamRule = idParamRule();