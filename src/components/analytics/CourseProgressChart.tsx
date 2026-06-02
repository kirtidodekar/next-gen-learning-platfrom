"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CourseProgressData } from "@/types/analytics";

interface CourseProgressChartProps {
  data: CourseProgressData[];
}

export function CourseProgressChart({ data }: CourseProgressChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Course Progress</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Distribution of course completion status</p>
      </div>

      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, percentage }) => `${status}: ${percentage}%`}
              outerRadius={80}
              innerRadius={45}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(12px)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} courses`,
                props.payload.status,
              ]}
            />
            <Legend
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {data.map((item) => (
          <div key={item.status} className="rounded-lg bg-white/5 p-2 sm:p-3 text-center">
            <div className="text-xl sm:text-2xl font-bold" style={{ color: item.color }}>
              {item.count}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{item.status}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
