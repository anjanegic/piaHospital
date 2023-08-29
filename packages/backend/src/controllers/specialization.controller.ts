import express from 'express'
import Specialization from '../models/spetialization'

export class SpecializationController {

    getAllSpecializations = (req: express.Request, res: express.Response) => {
        Specialization.find( (err, spec) => {
            if (err) console.log(err)
            else res.json(spec)
        })
    }

}