const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: '"{VALUE}" is not supported',
      },
    },
  },
  { timestamps: true },
);

// Indexes are used for fast search
connectionRequestSchema.index({toUserId: 1, fromUserId: 1})

connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this;

    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Request cannot be sent to self");
    }
})

const ConnectionRequest =  new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {
    ConnectionRequest
}