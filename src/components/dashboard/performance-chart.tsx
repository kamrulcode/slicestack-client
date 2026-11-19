import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const values = [18, 26, 22, 38, 31, 44, 52];
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Lightweight, dependency-free performance chart. It is intentionally static
 * until order analytics models exist; swap the values for real aggregates.
 */
export function PerformanceChart({
  title = "Weekly performance",
  description = "Orders across the last seven days",
}: {
  title?: string;
  description?: string;
}) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const max = Math.max(...values) * 1.15;
  const stepX = (width - padding * 2) / (values.length - 1);

  const points = values.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (value / max) * (height - padding * 2);
    return { x, y };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${title}: values trending from ${values[0]} to ${values[values.length - 1]}`}
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
                key={labels[index]}
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
            style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
          >
            {labels.map((label) => (
              <span key={label} className="text-center">
                {label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
