const LiveUpdate = require("../../db/schemas/LiveUpdate");

async function emitLiveUpdate(io, data) {

    const update = await LiveUpdate.create(data);

    const latest = await LiveUpdate
        .find()
        .sort({ createdAt: -1 })
        .limit(50)
        .select("_id");

    await LiveUpdate.deleteMany({
        _id: {
            $nin: latest.map(doc => doc._id)
        }
    });

    // Send to all connected users
    io.emit("liveUpdate", update.toObject());
}

module.exports = {
    emitLiveUpdate
};