import DashboardLayout from "@/components/DashboardLayout";
import TaskTracker from "@/components/TaskTracker";
import DataSources from "@/components/DataSources";
import OpsTrends from "@/components/OpsTrends";
import PlantHealth from "@/components/PlantHealth";
import RecentEvents from "@/components/RecentEvents";

export default function Index() {
  return (
    <DashboardLayout title="Main Dashboard" subtitle="Unified operational overview">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <OpsTrends />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <PlantHealth />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <RecentEvents />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <TaskTracker />
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.6s", opacity: 0 }}>
        <DataSources />
      </div>
    </DashboardLayout>
  );
}
