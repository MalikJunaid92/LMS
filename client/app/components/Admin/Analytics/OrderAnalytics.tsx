"use client";
export const dynamic = "force-dynamic";

import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useEffect } from "react";

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const { data, isLoading, error } = useGetOrdersAnalyticsQuery({});

  useEffect(() => {

  }, [data]);

  if (isLoading) return <Loader />;
  if (error) {
    console.error("API Error:", error);
    return <p className="text-center text-red-500">Failed to load analytics data.</p>;
  }

  // Check if data exists before mapping
  const analyticsData =
    data?.orders?.last12Months && Array.isArray(data.orders.last12Months)
      ? data.orders.last12Months.map((item: any, index: number) => ({
        name: item?.month || `Month ${index + 1}`,
        count: item?.count ?? 0,
      }))
      : [];

  if (analyticsData.length === 0) {
    return <p className="text-center text-gray-500">No analytics data available.</p>;
  }

  return (
    <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
      <div className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}>
        <h1 className={`${styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start`}>
          Orders Analytics
        </h1>
        {!isDashboard && <p className={`${styles.label} px-5`}>Last 12 months analytics data</p>}
      </div>
      <div className={`w-full ${!isDashboard ? "h-[90%]" : "h-full"} flex items-center justify-center`}>
        <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "100%" : "50%"}>
          <LineChart width={500} height={300} data={analyticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {!isDashboard && <Legend />}
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
