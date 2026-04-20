import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
};

export default function StatCard({ icon: Icon, value, label, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 text-center hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">{value}</div>
      <p className="text-xs md:text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
