"use client";
export const dynamic = "force-dynamic";

import { styles } from "@/app/styles/style";
import { useGetUserAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { FC } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../../Loader/Loader";

type Props = {
  isDashboard?: boolean;
};

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading, error } = useGetUserAnalyticsQuery({});

  if (isLoading) return <Loader />;
  if (error || !data?.users?.last12Months) {
    return <p className="text-center text-red-500">Failed to load analytics data.</p>;
  }

  const analyticsData = data.users.last12Months.map((item: any) => ({
    name: item.month,
    count: item.count, // Ensure this matches the dataKey in the chart
  }));

  return (
    <div
      className={`${!isDashboard
          ? "mt-[50px]"
          : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"
        }`}
    >
      <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
        <h1
          className={`${styles.title} ${isDashboard && "!text-[20px]"
            } px-5 !text-start`}
        >
          Users Analytics
        </h1>
        {!isDashboard && (
          <p className={`${styles.label} px-5`}>
            Last 12 months analytics data
          </p>
        )}
      </div>

      <div
        className={`w-full ${isDashboard ? "h-[30vh]" : "h-screen"
          } flex items-center justify-center`}
      >
        <ResponsiveContainer
          width={isDashboard ? "100%" : "90%"}
          height={!isDashboard ? "50%" : "100%"}
        >
          <AreaChart
            data={analyticsData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count" // Fixed the dataKey issue
              stroke="#4d62d9"
              fill="#4d62d9"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalytics;
