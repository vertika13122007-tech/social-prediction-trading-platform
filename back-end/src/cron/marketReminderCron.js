const cron = require("node-cron");

const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");

const { publishEvent } = require("../utils/eventService");

cron.schedule("*/5 * * * *", async () => {
    try {

        console.log("Checking markets closing soon...");

        const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);

        const markets = await Market.find({
            status: "OPEN",
            closingReminderSent: false,
            endsAt: {
                $gte: new Date(),
                $lte: oneHourLater
            }
        });

        for (const market of markets) {

            const participants = await Position.find({
                marketId: market._id,
                settled: false
            }).distinct("userId");

            await Promise.all(
                participants.map((userId) =>
                    publishEvent({
                        user: userId,
                        type: "system",
                        title: "Prediction Closing Soon ⏰",
                        message: `"${market.title}" closes within the next hour. Place your final trades now!`
                    })
                )
            );

            market.closingReminderSent = true;

            await market.save();

            console.log(
                `Reminder sent for market: ${market.title}`
            );
        }

    } catch (error) {

        console.error("Cron Error:", error);

    }
});