"use client";

import { ExternalLink } from "lucide-react";

const SCORE_KEYS = ["Conexão/Rapport", "Apres. Autoridade", "Entendimento Dores", "Apres. Solução", "Agendamento"];

function formatDateTime(value) {
    if (!value) return "—";
    const raw = String(value).trim();

    const match = raw.match(/^\[DateTime:\s*(.+)\]$/);
    if (match && match[1]) {
        const parsed = new Date(match[1]);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }
    }

    return raw;
}

function getMeetingBadge(value) {
    const v = (value || "").toUpperCase();
    const yes = v === "TRUE" || v === "SIM" || v === "YES";
    const color = yes
        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        : "bg-red-500/20 text-red-300 border-red-500/30";
    return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${color}`}>
            {yes ? "Sim" : "Não"}
        </span>
    );
}

function getAvgScore(row) {
    const vals = SCORE_KEYS.map(k => parseFloat(row[k])).filter(v => !isNaN(v));
    if (vals.length === 0) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function ScoreBar({ value }) {
    const score = parseFloat(value);
    if (isNaN(score)) return <span className="text-gray-600 text-xs">—</span>;
    const pct = Math.min((score / 10) * 100, 100);
    const color = score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-500" : "bg-red-500";
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-400">{score}</span>
        </div>
    );
}

export default function ClientTable({ data, onOpenModal }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 text-sm">
                {data ? "Nenhuma ligação encontrada com os filtros aplicados." : "Carregue uma planilha para ver os dados."}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-secondary/30 text-xs uppercase text-gray-500 font-medium tracking-wider">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Data</th>
                        <th className="px-4 py-3">Prospect / Empresa</th>
                        <th className="px-4 py-3">SDR</th>
                        <th className="px-4 py-3">Reunião?</th>
                        <th className="px-4 py-3 hidden md:table-cell">Probabilidade</th>
                        <th className="px-4 py-3 hidden lg:table-cell">Score Médio</th>
                        <th className="px-4 py-3 rounded-tr-lg text-center">Doc</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((row, idx) => {
                        const avg = getAvgScore(row);
                        return (
                            <tr
                                key={idx}
                                className="hover:bg-white/5 transition-colors group cursor-pointer"
                                onClick={() => onOpenModal && onOpenModal(row)}
                            >
                                <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">
                                    {formatDateTime(row["Data"])}
                                </td>
                                <td className="px-4 py-4 font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                    {row["Prospect / Empressa"]}
                                </td>
                                <td className="px-4 py-4 text-gray-300 text-sm">
                                    {row["SDR / Pré-venda"]}
                                </td>
                                <td className="px-4 py-4">
                                    {getMeetingBadge(row["Reunião Marcada?"])}
                                </td>
                                <td
                                    className="px-4 py-4 hidden md:table-cell text-gray-400 text-xs max-w-[200px] truncate"
                                    title={row["Probabilidade Show"]}
                                >
                                    {row["Probabilidade Show"] || "—"}
                                </td>
                                <td className="px-4 py-4 hidden lg:table-cell">
                                    <ScoreBar value={avg} />
                                </td>
                                <td
                                    className="px-4 py-4 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {row["Link Documento"] ? (
                                        <a
                                            href={row["Link Documento"]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex justify-center"
                                            title="Abrir documento"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <span className="text-gray-600">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
