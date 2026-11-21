import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartPoint = { date: string; count: number };

function weekdayLabel(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(value.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(value);
}

/**
 * Lightweight, dependency-free order chart. The series always comes from the
 * backend's real daily counts; an empty week renders a flat line at zero.
 */
export function PerformanceChart({
  title = "Weekly activity",
  description = "Orders across the last seven days",
  data = [],
}: {
  title?: string;
  description?: string;
  data?: ChartPoint[];
}) {
  const values = data.map((point) => point.count);
  const labels = data.map((point) => weekdayLabel(point.date));
  const width = 640;
  const height = 220;
  const padding = 24;
  const peak = Math.max(...values, 1) * 1.15;
  const stepX =
    values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (value / peak) * (height - padding * 2);
    return { x, y };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} · {total} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${title}: ${total} orders across the last seven days`}
            className="h-auto w-full"
          >
            <defs>
              <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((row) => {
              const y = padding + ((height - padding * 2) / 3) * row;
              return (
                <line
                  key={row}
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 6"
                />
              );
            })}
            <polygon points={area} fill="url(#chart-area)" />
            <polyline
              points={line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={data[index]?.date ?? index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
            ))}
          </svg>
          <div
            className="grid text-xs text-muted-foreground"
            style={{
              gridTemplateColumns: `repeat(${Math.max(labels.length, 1)}, minmax(0, 1fr))`,
            }}
          >
            {labels.map((label, index) => (
              <span key={`${label}-${index}`} className="text-center">
                {label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
