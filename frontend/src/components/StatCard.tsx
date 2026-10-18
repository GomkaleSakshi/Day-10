type StatCardProps = {
  title: string;
  value: number;
  accent?: string;
};

export function StatCard({ title, value, accent = '#1f5fbf' }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${accent}` }}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}
