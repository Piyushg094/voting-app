const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user')
const {jwtAuthMiddleware } = require('../jwt')

const checkAdminRole = async (userId)=>{
  try{
    const userData = await User.findById(userId);
    console.log(userData.role)
    return userData.role == 'admin' ? true : False;
  }catch(err){
    return false;
  }
}

router.post('/addCandidate', jwtAuthMiddleware, async ( req, res)=>{
    try{

        const userId = req.user.id
        console.log(userId)
        const isAdmin = await checkAdminRole(userId)
        if(!isAdmin){
            return res.status(401).json({ error: 'only admin can have access to ad d candidate data' });
        }
        console.log('data saved')
        const reqData = req.body
        const candidateData = new Candidate(reqData)
        const response = await candidateData.save()
        res.status(200).json({message:'candidate created successfully ', response : response})


    }catch(err){
        res.status(500).json({message : `internal server error ${err}`})
    }
    
});

router.put('/:candidateId',jwtAuthMiddleware, async (req, res)=>{

    try{
        const userId = req.user.id
        if(!checkAdminRole(userId))
            return res.status(401).json({ error: 'only admin can have access to modify candidate data' });

        const candidateID = req.params.candidateId
        const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID,updateCandidateData,{
            new: true,
            runValidators:  true,
        })

        if(!response){
            return res.status(404).json({ error: 'candidate not found' });
        }

        console.log('candidate data updated')
        res.status(200).json(response);

    }catch(err){
        res.status(500).json({message : `internal server error ${err}`})
    }
})


router.delete('/:candidateId',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userId = req.user.id
        if(!checkAdminRole(userId))
            return res.status(401).json({ error: 'only admin can have access to modify candidate data' });

        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if(!response){
            return res.status(404).json({ error: 'candidate not found' });
        }

        console.log('candidate deleted successfully')
        res.status(200).json(response);
    }catch(err){
        res.status(500).json({message : `internal server error ${err}`})
    }
})
module.exports = router