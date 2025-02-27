import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    // Get first day of the month
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    
    // Get last day of the month
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
    
    // Format Month & Year correctly
    const monthYear = startDate.toLocaleString("default", { month: "short", year: "numeric" });

    // Count documents within the month range
    const count = await model.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    last12Months.push({
      month: monthYear,
      count: count,
    });
  }

  return { last12Months };
}
