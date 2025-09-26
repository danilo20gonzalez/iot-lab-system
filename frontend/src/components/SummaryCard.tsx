interface SummaryCardProps {
    title: string;
    value: string | number;
  }
  
  export default function SummaryCard({ title, value }: SummaryCardProps) {
    return (
      <div 
        className="bg-white p-3 rounded-lg text-center border border-[#367c29] hover:shadow-md transition-all duration-200 cursor-pointer"
        style={{ boxShadow: '0 2px 8px rgba(54, 124, 41, 0.08)' }}
      >
        <p className="text-gray-600 text-xs font-medium mb-1 uppercase tracking-wide">
          {title}
        </p>
        <h2 
          className="text-xl font-bold"
          style={{ color: '#367c29' }}
        >
          {value}
        </h2>
      </div>
    );
  }