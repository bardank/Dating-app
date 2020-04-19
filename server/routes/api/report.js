const express = require('express');
const router =  express.Router();
const auth = require('../../middleware/auth');
const Report = require('../../models/Report')
const {check, validationResult} = require ('express-validator');

router.post('/:id', [auth,
    check('reportReason', 'Interested In field is empty').not().isEmpty()
], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
        let newReport = await new Report({
            reportedBy : req.user.id,
            reportedOn : req.params.id,
            onModel : req.onModel,
            reportReason: req.reportReason
        });

        await newReport.save()
        res.json('done')
        
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}) 

module.exports = router;
