/**
 * Dynamic Recharts wrapper — loaded only on the couple dashboard.
 * All Recharts subcomponents are re-exported from here so callers
 * only need a single dynamic import.
 */
"use client";

export {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
	AreaChart,
	Area,
	BarChart,
	Bar,
} from "recharts";
