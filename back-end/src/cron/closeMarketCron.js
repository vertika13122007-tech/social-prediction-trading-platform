const cron = require("node-cron");

const Market = require("../../db/schemas/Market");

cron.schedule("* * * * *", async () => {
    try {

        console.log("Checking expired markets...");
        const expiredMarkets = await Market.find({
            status: "OPEN",
            endsAt: { $lte: new Date() }
        });
        for (const market of expiredMarkets) {
            market.status = "CLOSED";
            await market.save();

            const io = global.io;

            emitLiveUpdate(io, {
                type: "market",
                title: "Market Closed",
                desc: `${market.title} is now closed.`,
            });

            console.log(`✅ Closed market: ${market.title}`);
        }

    } catch (err) {
        console.error("Close Cron Error:", err);
    }
});