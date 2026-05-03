import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function QuickStats() {
    const stats = [
        { label: "Total Orders", value: "428", change: "up", color: "text-amber-700" },
        { label: "Completed Orders", value: "395", change: "up", color: "text-amber-700" },
        { label: "Cancelled Orders", value: "18", change: "down", color: "text-yellow-700" },
        { label: "Revenue Today", value: "Rp 12.5M", change: "up", color: "text-amber-700" },
    ];

    return (
        <div id="quick-stats" className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <div className="mt-3 flex items-end justify-between">
                        <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        <div className={`${stat.change === 'up' ? 'text-amber-700' : 'text-yellow-700'}`}>
                            {stat.change === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
