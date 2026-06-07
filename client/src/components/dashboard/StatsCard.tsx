interface StatsCardProps {
    title: string;
    value: number;
    subtitle?: string;
    icon?: React.ReactNode;
}

const StatsCard = ({title,value,subtitle,icon}:StatsCardProps) => {
    return (
         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      {icon && (
        <p className="text-indigo-400">{icon}</p>
      )}

      <h3 className="text-3xl font-bold text-white mt-2">
        {value}
      </h3>

      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
    );
};

export default StatsCard;