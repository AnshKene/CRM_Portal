'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient';

export default function SalesPipelineView() {
  const [pipeline, setPipeline] = useState([]);

  useEffect(() => {
    apiClient.get('/deals/pipeline').then((res) => setPipeline(res.data));
  }, []);

  return (
    <section>
      <h2>Sales Pipeline</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {pipeline.map((stageGroup) => (
          <article key={stageGroup._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <h3>{stageGroup._id}</h3>
            <p>Deals: {stageGroup.totalDeals}</p>
            <p>Value: ${stageGroup.totalValue.toLocaleString()}</p>
            {stageGroup.deals.map((deal) => (
              <div key={deal.id} style={{ background: '#f7f7f7', padding: 8, marginBottom: 8 }}>
                <strong>{deal.title}</strong>
                <p>${deal.dealValue.toLocaleString()}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
