'use client';

import { useEffect, useMemo, useState } from 'react';
import apiClient from '@/services/apiClient';

export default function CRMDashboard() {
  const [metrics, setMetrics] = useState({ leadConversion: {}, wonLost: [], salesPerformance: [], revenue: [] });

  useEffect(() => {
    const loadDashboard = async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();
      const endDate = now.toISOString();

      const [leadConversion, wonLost, salesPerformance, revenue] = await Promise.all([
        apiClient.get('/analytics/lead-conversion-rate', { params: { startDate, endDate } }),
        apiClient.get('/analytics/deals-won-lost', { params: { startDate, endDate } }),
        apiClient.get('/analytics/sales-performance', { params: { startDate, endDate } }),
        apiClient.get('/analytics/monthly-revenue', { params: { startDate, endDate } }),
      ]);

      setMetrics({
        leadConversion: leadConversion.data,
        wonLost: wonLost.data,
        salesPerformance: salesPerformance.data,
        revenue: revenue.data,
      });
    };

    loadDashboard();
  }, []);

  const totalRevenue = useMemo(() => metrics.revenue.reduce((acc, item) => acc + item.revenue, 0), [metrics.revenue]);

  return (
    <section>
      <h2>CRM Dashboard</h2>
      <p>Lead Conversion: {Number(metrics.leadConversion.conversionRate || 0).toFixed(2)}%</p>
      <p>Total Revenue (selected period): ${totalRevenue.toLocaleString()}</p>
      <ul>
        {metrics.wonLost.map((item) => (
          <li key={item._id}>{item._id}: {item.count}</li>
        ))}
      </ul>
    </section>
  );
}
