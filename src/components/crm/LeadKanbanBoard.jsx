'use client';

import { useEffect, useMemo, useState } from 'react';
import apiClient from '@/services/apiClient';

const columns = ['New', 'Contacted', 'Qualified', 'Lost'];

export default function LeadKanbanBoard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    apiClient.get('/leads').then((res) => setLeads(res.data));
  }, []);

  const grouped = useMemo(
    () => columns.reduce((acc, status) => ({ ...acc, [status]: leads.filter((lead) => lead.status === status) }), {}),
    [leads]
  );

  return (
    <section>
      <h2>Lead Kanban Board</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {columns.map((status) => (
          <article key={status} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <h3>{status}</h3>
            {grouped[status]?.map((lead) => (
              <div key={lead._id} style={{ marginBottom: 10, background: '#f7f7f7', padding: 8 }}>
                <strong>{lead.name}</strong>
                <p>{lead.email}</p>
                <small>Score: {lead.score}</small>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
