import Card from "./layout/Card";

const StatCard = ({ label, value, sub, accent }) => (
  <Card>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
    <p className={`mt-1.5 text-2xl font-semibold ${accent ?? "text-gray-900"}`}>{value}</p>
    {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
  </Card>
);

export default StatCard