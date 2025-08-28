interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-slate-800/70 rounded-lg p-6 border border-slate-700 hover:border-purple-400/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-300">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}