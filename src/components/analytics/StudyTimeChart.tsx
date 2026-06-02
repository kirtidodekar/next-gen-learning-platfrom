"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { StudyTimeData } from "@/types/analytics";

interface StudyTimeChartProps {
  data: StudyTimeData[];
}

export function StudyTimeChart({ data }: StudyTimeChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Study Time</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Daily study hours over the last 30 days</p>
      </div>

      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              label={{ value: "Hours", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.5)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(12px)",
              }}
              labelStyle={{ color: "#fff", fontWeight: 600 }}
              formatter={(value: number) => [`${value.toFixed(2)}h`, "Study Time"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
