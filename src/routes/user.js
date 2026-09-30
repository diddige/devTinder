const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName";

// Get all pending requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    const loggedInUser = req.user;

    try{
        const requestsReceived = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", SAFE_USER_DATA);

        res.status(200).json({
            message: "Interested users fetched successfully",
            data: requestsReceived
        })
    } catch(error) {
        res.status(400).send(`Unable to fetch received requests : ${error.message}`);
    }
})

// Get all connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;

    try{
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("toUserId", SAFE_USER_DATA)
        .populate("fromUserId", SAFE_USER_DATA);

        const data = connections.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        })

        res.status(200).json({
            message: "Connections fetched successfully",
            data
        })

    } catch(error){
        res.status(400).send(`Unable to fetch connections : ${error.message}`);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    // User should see all cards except
    // 1. his own card
    // 2. already sent connection requests
    // 3. his connections and rejected profiles as well
    // 4. ignored profiles
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1)*limit;
 
    console.log(page, limit,);

    try {

        // Get all the requested whether user sent or got the requests.
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ] 
        }).select("fromUserId toUserId");

        const hideFromRequests = new Set();

        // Added to set for unique ids
        connectionRequests.map(row => {
            hideFromRequests.add(row.fromUserId.toString());
            hideFromRequests.add(row.toUserId.toString());
        })

        const data = await User.find({
            _id: {
                $nin: Array.from(hideFromRequests),
                $ne: loggedInUser._id
            }
        }).skip(skip).limit(limit);

        res.status(200).json({
            message: "Feed fetched successfully",
            data
        })

    } catch(error){
        res.status(400).send(`Unable to fetch the feed : ${error.message}`);
    }
})

module.exports = {
    userRouter
}