const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");
 
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    const {status, toUserId} = req.params;

    try{
        const fromUser = req.user;
        const fromUserId = fromUser._id;
        const toUser = await User.findById(toUserId);

        // const indexes = await User.collection.getIndexes();
        // const indexes1 = await ConnectionRequest.collection.getIndexes();
        // console.log(indexes, indexes1);

        const allowedStatuses = ["ignored", "interested"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({message: "Status not allowed"});
        }

        // Check whether toUser exists or not
        if(!toUser){
            return res.status(400).json({message: "User not found"});
        }

        // Check whether connection request already exists or not
        const existingConnectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}]
        });

        console.log(existingConnectionRequest);
        if(existingConnectionRequest.length > 0){
            return res.status(400).json({message: "Connection Request already exists"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message: fromUser.firstName + " " + status + " " + toUser.firstName,
            data
        })
    } catch(error) {
        res.status(400).send(`Sending connection request failed : ${error.message}`);
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInUser = req.user._id;

    try{
        const allowedStatuses = ["accepted", "rejected"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({message: "Status not allowed"})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            fromUserId: requestId, toUserId: loggedInUser, status: "interested"
        });        
        if(!existingConnectionRequest){
            return res.status(404).json({message: "Connection request doesnot exist"});
        }

        const requestedUser = await User.findById(requestId);

        existingConnectionRequest.status = status;
        const data = await existingConnectionRequest.save();
        res.status(200).json({
            message: req.user.firstName + " " + status + " request from " + requestedUser.firstName,
            data
        })
    } catch (error) {
        res.status(400).send(`Request cannot be accepted: ${error.message}`);
    }
})

module.exports = {
    requestRouter
}