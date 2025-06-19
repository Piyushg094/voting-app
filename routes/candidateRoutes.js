const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user')
const {jwtAuthMiddleware } = require('../jwt')


// show the candidate list to the users
router.get('/list',jwtAuthMiddleware, async (req,res)=>{

    try{
        
        let candidateList =  await Candidate.find({}).lean()
        candidateList.sort((a,b) => a.PartyCandidateNum - b.PartyCandidateNum);
      
        candidateList.map((data)=>{
            delete data.votes
            delete data.voteCount
        })
      
        res.status(200).json({data:candidateList})
        

    }catch(err){
        res.status(500).json(`internal server error ${err}`);
    }
})


// user vote to the candidate
router.get('/vote/:candidateId',jwtAuthMiddleware, async (req,res)=>{

    try{

        const candidateId = req.params.candidateId;
        const userId = req.user.id
        console.log(candidateId,userId)
        const candidate = await Candidate.findById(candidateId);
        if(!candidate)
            return res.status(404).json({message : 'candidate not found'});

        const user = await User.findById(userId)
        if(!user)
            return res.status(404).json({message : 'user not found'});

        if(user.isVote){
           return res.status(400).json({message: 'you have already voted'});
        }
        if(user.role == 'admin'){
           return res.status(400).json({message : 'admin can not allow to vote'})
        }
  
        // update the candidate document to recode the vote
        candidate.votes.push({user:userId})
        candidate.voteCount++;
        await candidate.save()

        user.isVote=true
        user.save()

        res.status(200).json({ message: 'vote recorded successfully! Thanks..'})




    }catch(err){
        res.status(500).json({message: " internal server error"});
    }
})


//vote count and give tho position which one is first and second third
router.get('/voted/count',jwtAuthMiddleware, async (req,res) =>{
  
    try{
        
            const candidateData = await Candidate.find({}).lean()
          
            let voteCount = []

            voteCount = candidateData.map((data)=>{
                return {
                    name : data.name,
                    voteCount : data.voteCount,
                    cadidateParty : data.party,
                    PartyCandidateNum : data.PartyCandidateNum
                }
            })

            voteCount.sort((a,b)=> b.voteCount - a.voteCount)

            res.status(200).json({data:voteCount})


    }catch(err){
        res.status(500).json({message: " internal server error"});
    }
})

module.exports= router


