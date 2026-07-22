import {
    TrendingUp,
    DollarSign,
    Trophy,
    Bell,
    Sparkles,
    Users,
    Clock,
    MessageSquare,
    Volume2
} from "lucide-react";

export const notificationConfig = {

    tradeUpdates: {
        Icon: TrendingUp,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        tag: "Trending",
        tagColor:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    },

    priceAlerts: {
        Icon: DollarSign,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        tag: "Price",
        tagColor:
            "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
    },

    payouts: {
        Icon: DollarSign,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        tag: "Payout",
        tagColor:
            "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
    },

    leaderboard: {
        Icon: Trophy,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        tag: "Rank",
        tagColor:
            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    },

    marketing: {
        Icon: MessageSquare,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        tag: "Marketing",
        tagColor:
            "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },

    system: {
        Icon: Bell,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        tag: "System",
        tagColor:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    }

};