import { motion } from "framer-motion";
import StatsCards       from "../components/admin/StatsCards";
import AdminCharts      from "../components/admin/AdminCharts";
import MarketsTable     from "../components/admin/MarketsTable";
import UsersTable       from "../components/admin/UsersTable";
import Transactions     from "../components/admin/Transactions";
import ActivityTimeline from "../components/admin/ActivityTimeline";
import NotificationsPanel from "../components/admin/NotificationsPanel";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function AdminDashboard() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6 pb-10">

      {/* Stats */}
      <StatsCards />

      {/* Charts */}
      <AdminCharts />

      {/* Markets table */}
      <MarketsTable />

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UsersTable />
        <Transactions />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityTimeline />
        <NotificationsPanel />
      </div>

    </motion.div>
  );
}