import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { differenceInDays } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface TaxCalculatorProps {
  contractDate: Date;
  originalPrice: number;
  askingPrice: number;
  depositPaid: number;
  assignmentFeePercent: number;
}

export function TaxCalculator({ 
  contractDate, 
  originalPrice, 
  askingPrice, 
  depositPaid, 
  assignmentFeePercent 
}: TaxCalculatorProps) {
  const today = new Date();
  const daysHeld = differenceInDays(today, contractDate);
  
  // Calculations
  const grossProfit = askingPrice - originalPrice;
  const assignmentFee = askingPrice * (assignmentFeePercent / 100);
  const realtorComm = askingPrice * 0.035; // Estimated 3.5%
  const legalFees = 1500;
  
  const totalExpenses = assignmentFee + realtorComm + legalFees;
  const netProfitBeforeTax = grossProfit - totalExpenses;
  
  // BC Home Flipping Tax Logic
  let taxRate = 0;
  if (daysHeld < 365) {
    taxRate = 0.20;
  } else if (daysHeld < 730) {
    // Sliding scale: 20% * (1 - (days - 365)/365)
    // Simplified for mockup
    taxRate = 0.10; 
  }
  
  const estimatedTax = Math.max(0, netProfitBeforeTax * taxRate);
  const finalCashToSeller = depositPaid + netProfitBeforeTax - estimatedTax;

  // Chart Data
  const data = [
    { name: "Seller Net Cash", value: finalCashToSeller, color: "var(--chart-3)" },
    { name: "Taxes (BCHFT)", value: estimatedTax, color: "var(--chart-4)" },
    { name: "Fees & Comm.", value: totalExpenses, color: "var(--chart-2)" },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg text-brand-navy flex items-center gap-2">
          Profit & Tax Estimator
        </CardTitle>
        <CardDescription>Based on BC Home Flipping Tax (2025)</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Warning Banner */}
        {daysHeld < 365 && (
          <Alert variant="destructive" className="mb-6 bg-red-50 text-red-900 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">High Tax Warning</AlertTitle>
            <AlertDescription className="text-xs text-red-700">
              Contract held for only {daysHeld} days (&lt; 365). Estimated 20% BCHFT applies on net profit.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Chart */}
          <div className="h-[200px] w-full relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground font-medium">Est. Net</span>
              <span className="text-lg font-bold text-brand-navy">{formatCurrency(finalCashToSeller)}</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200">
              <span className="text-muted-foreground">Gross Profit</span>
              <span className="font-medium text-green-600">+{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200">
              <span className="text-muted-foreground">Assignment Fee ({assignmentFeePercent}%)</span>
              <span className="font-medium text-brand-navy">-{formatCurrency(assignmentFee)}</span>
            </div>
             <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200">
              <span className="text-muted-foreground">Realtor Comm. (3.5%)</span>
              <span className="font-medium text-brand-navy">-{formatCurrency(realtorComm)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-200 bg-red-50/50 px-2 -mx-2 rounded">
              <span className="text-red-800 font-medium">Est. BCHFT Tax</span>
              <span className="font-bold text-red-600">-{formatCurrency(estimatedTax)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
