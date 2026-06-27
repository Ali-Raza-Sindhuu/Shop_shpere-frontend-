import Card from "./layout/Card";
import Spark from "./Spark";

const EARNING_CHIPS = {
  dollar: { bg: "bg-[#fff1e6]", text: "text-orange-600", symbol: "$" },
  coin:   { bg: "bg-[#eef9f1]", text: "text-[#1a7a44]",  symbol: "%" },
  card:   { bg: "bg-[#eef4ff]", text: "text-gray-700",   symbol: "#" },
};

export const ProductTile = ({ name }) => {
  const palette = ["bg-[#fff1e6] text-orange-600", "bg-[#eef4ff] text-gray-700", "bg-[#eef9f1] text-[#1a7a44]", "bg-[#fefce8] text-[#854d0e]"];
  const idx = name.length % palette.length;
  return (
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${palette[idx]}`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

const EarningStatCard = ({ chip, label, value, sub, subAccent, spark, sparkColor, trendUp }) => {
  const c = EARNING_CHIPS[chip];
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${c.bg} ${c.text}`}>
            {c.symbol}
          </div>
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        <Spark data={spark} color={sparkColor} />
      </div>
      {sub && (
        <p className="mt-3 text-xs text-gray-400">
          {sub} <span className={`font-medium ${subAccent}`}>{trendUp ? "▲" : "▼"} 10%</span>
        </p>
      )}
    </Card>
  );
};

export default EarningStatCard