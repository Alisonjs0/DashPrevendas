import { Phone, CalendarCheck, TrendingUp } from "lucide-react";

const SCORE_KEYS = ["Conexão/Rapport", "Apres. Autoridade", "Entendimento Dores", "Apres. Solução", "Agendamento"];

function isMeetingScheduled(row) {
    const v = (row["Reunião Marcada?"] || "").toUpperCase();
    return v === "TRUE" || v === "SIM" || v === "YES";
}

export default function DashboardStats({ data }) {
    const total = data.length;

    const scheduled = data.filter(isMeetingScheduled).length;
    const scheduledPct = total > 0 ? Math.round((scheduled / total) * 100) : 0;

    let scoreSum = 0, scoreCount = 0;
    data.forEach(row => {
        SCORE_KEYS.forEach(key => {
            const v = parseFloat(row[key]);
            if (!isNaN(v)) { scoreSum += v; scoreCount++; }
        });
    });
    const avgScore = scoreCount > 0 ? (scoreSum / scoreCount).toFixed(1) : "—";

    const stats = [
        {
            title: "Total de Ligações",
            value: total,
            icon: Phone,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Reuniões Marcadas",
            value: scheduled,
            sub: total > 0 ? `${scheduledPct}% de taxa` : null,
            icon: CalendarCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Score Médio",
            value: avgScore,
            sub: "Média geral das ligações",
            icon: TrendingUp,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500`} />
                    <div className="flex justify-between items-start z-10">
                        <div className={`p-3 rounded-lg ${stat.bg} border border-white/5`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <div className="mt-4 z-10">
                        <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                        <p className="text-3xl font-bold mt-1 text-white tracking-tight">{stat.value}</p>
                        {stat.sub && <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}
