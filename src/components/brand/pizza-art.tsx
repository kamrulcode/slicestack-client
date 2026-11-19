import type { PizzaArtVariant } from "@/types/menu";
import { cn } from "@/lib/utils";

const labels: Record<PizzaArtVariant, string> = {
  pepperoni: "Pepperoni pizza illustration",
  garden: "Garden vegetable pizza illustration",
  cheese: "Cheese burst pizza illustration",
  meat: "Meat lovers pizza illustration",
  bbq: "BBQ chicken pizza illustration",
  margherita: "Margherita pizza illustration",
};

const sauceColor: Record<PizzaArtVariant, string> = {
  pepperoni: "#c8402c",
  garden: "#cc4a31",
  cheese: "#d1512f",
  meat: "#c13d29",
  bbq: "#94401f",
  margherita: "#c8402c",
};

export function PizzaArt({
  variant,
  className,
  background = true,
}: {
  variant: PizzaArtVariant;
  className?: string;
  /** Draw the cream photo backdrop. Turn off for cut-out hero artwork. */
  background?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={labels[variant]}
      className={cn("size-full", className)}
    >
      {background ? (
        <>
          <rect width="400" height="320" fill="#f6e7d2" />
          <circle cx="320" cy="24" r="120" fill="#fdf4e7" opacity="0.85" />
          <circle cx="36" cy="296" r="96" fill="#efd9b8" opacity="0.55" />

          <g fill="#ffffff" opacity="0.55">
            <circle cx="44" cy="54" r="3" />
            <circle cx="66" cy="80" r="1.8" />
            <circle cx="352" cy="264" r="2.6" />
            <circle cx="336" cy="40" r="1.6" />
          </g>
          <g fill="#c98f56" opacity="0.28">
            <circle cx="34" cy="272" r="2.4" />
            <circle cx="370" cy="86" r="3" />
            <circle cx="300" cy="300" r="1.8" />
          </g>
        </>
      ) : null}

      <g style={{ filter: "drop-shadow(0 14px 16px rgba(122, 60, 18, 0.24))" }}>
        <circle cx="200" cy="165" r="138" fill="#c98843" />
        <circle cx="200" cy="165" r="133" fill="#e9b56a" />
        <circle cx="200" cy="165" r="126" fill="#f0c383" opacity="0.7" />
        <g fill="#b5762f" opacity="0.35">
          <ellipse cx="86" cy="98" rx="7" ry="4" transform="rotate(-28 86 98)" />
          <ellipse cx="314" cy="98" rx="7" ry="4" transform="rotate(28 314 98)" />
          <ellipse cx="314" cy="232" rx="7" ry="4" transform="rotate(-28 314 232)" />
          <ellipse cx="86" cy="232" rx="7" ry="4" transform="rotate(28 86 232)" />
          <ellipse cx="200" cy="32" rx="4" ry="7" />
          <ellipse cx="200" cy="298" rx="4" ry="7" />
        </g>
        <circle cx="200" cy="165" r="112" fill={sauceColor[variant]} />
        <circle cx="200" cy="165" r="104" fill="#f5d28a" />
        <circle cx="172" cy="138" r="66" fill="#fbe3a8" opacity="0.55" />
        <Toppings variant={variant} />
        <circle
          cx="200"
          cy="165"
          r="112"
          fill="none"
          stroke="#9c4d1c"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <circle
          cx="200"
          cy="165"
          r="104"
          fill="none"
          stroke="#a35a24"
          strokeOpacity="0.14"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

function Toppings({ variant }: { variant: PizzaArtVariant }) {
  switch (variant) {
    case "pepperoni":
      return (
        <>
          <Pepperoni cx={152} cy={122} />
          <Pepperoni cx={234} cy={116} r={12} />
          <Pepperoni cx={262} cy={182} />
          <Pepperoni cx={214} cy={222} r={12} />
          <Pepperoni cx={148} cy={208} />
          <Pepperoni cx={196} cy={166} r={11} />
          <Pepperoni cx={112} cy={162} r={10} />
          <Pepperoni cx={246} cy={246} r={9} />
          <Basil x={132} y={144} rotate={-28} scale={0.8} />
          <Basil x={226} y={188} rotate={38} scale={0.7} />
        </>
      );
    case "garden":
      return (
        <>
          <PepperStrip x={150} y={124} rotate={-22} />
          <PepperStrip x={242} y={126} rotate={38} />
          <PepperStrip x={248} y={206} rotate={-16} />
          <PepperStrip x={156} y={214} rotate={18} />
          <TomatoSlice cx={180} cy={152} r={14} />
          <TomatoSlice cx={232} cy={212} r={13} />
          <Olive cx={132} cy={180} />
          <Olive cx={214} cy={124} />
          <Olive cx={262} cy={172} />
          <Mozzarella cx={168} cy={244} r={10} />
          <Basil x={196} y={190} rotate={-18} scale={0.85} />
          <Basil x={240} y={238} rotate={22} scale={0.7} />
        </>
      );
    case "cheese":
      return (
        <>
          <g fill="#f9db94" opacity="0.9">
            <ellipse cx="168" cy="138" rx="30" ry="22" />
            <ellipse cx="236" cy="196" rx="27" ry="21" />
            <ellipse cx="158" cy="212" rx="23" ry="17" />
          </g>
          <Mozzarella cx={196} cy={166} r={13} />
          <Mozzarella cx={242} cy={122} r={10} />
          <Mozzarella cx={136} cy={190} r={9} />
          <Mozzarella cx={218} cy={236} r={10} />
          <path
            d="M150 148 Q170 164 154 190"
            fill="none"
            stroke="#f0b64a"
            strokeLinecap="round"
            strokeWidth="4"
            opacity="0.8"
          />
          <path
            d="M232 148 Q248 166 236 190"
            fill="none"
            stroke="#f0b64a"
            strokeLinecap="round"
            strokeWidth="3.5"
            opacity="0.7"
          />
          <g fill="#e0a437" opacity="0.55">
            <circle cx="184" cy="206" r="2.6" />
            <circle cx="214" cy="142" r="2.2" />
            <circle cx="258" cy="214" r="2.4" />
          </g>
        </>
      );
    case "meat":
      return (
        <>
          <Pepperoni cx={148} cy={122} r={12} />
          <Pepperoni cx={238} cy={124} r={11} />
          <Pepperoni cx={256} cy={204} r={12} />
          <Sausage cx={182} cy={166} />
          <Sausage cx={136} cy={196} />
          <Sausage cx={222} cy={232} />
          <Sausage cx={212} cy={120} r={8} />
          <Bacon x={172} y={236} rotate={-14} />
          <Bacon x={250} y={164} rotate={62} />
          <Bacon x={136} y={152} rotate={104} />
          <Basil x={196} y={202} rotate={28} scale={0.7} />
        </>
      );
    case "bbq":
      return (
        <>
          <Chicken x={162} y={128} rotate={-18} />
          <Chicken x={236} y={130} rotate={22} />
          <Chicken x={254} y={206} rotate={-12} />
          <Chicken x={168} y={212} rotate={14} />
          <Chicken x={208} y={168} rotate={40} />
          <Onion x={132} y={168} rotate={-24} />
          <Onion x={228} y={224} rotate={18} />
          <Onion x={214} y={110} rotate={-8} />
          <Basil x={186} y={244} rotate={-20} scale={0.7} />
          <g fill="#9c4d1c" opacity="0.35">
            <circle cx="188" cy="140" r="3" />
            <circle cx="248" cy="178" r="2.4" />
            <circle cx="150" cy="238" r="2.6" />
          </g>
        </>
      );
    case "margherita":
      return (
        <>
          <TomatoSlice cx={160} cy={136} r={16} />
          <TomatoSlice cx={242} cy={178} r={15} />
          <TomatoSlice cx={184} cy={228} r={14} />
          <Mozzarella cx={214} cy={130} r={12} />
          <Mozzarella cx={148} cy={202} r={11} />
          <Mozzarella cx={238} cy={240} r={10} />
          <Mozzarella cx={188} cy={176} r={9} />
          <Basil x={204} y={198} rotate={-16} scale={0.95} />
          <Basil x={134} y={166} rotate={34} scale={0.8} />
          <Basil x={256} y={140} rotate={-42} scale={0.75} />
          <Basil x={198} y={112} rotate={12} scale={0.7} />
        </>
      );
  }
}

function Pepperoni({
  cx,
  cy,
  r = 13,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#bf3826" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#96271b"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <circle
        cx={cx - r * 0.28}
        cy={cy - r * 0.3}
        r={r * 0.22}
        fill="#e6836b"
        opacity="0.8"
      />
      <circle
        cx={cx + r * 0.34}
        cy={cy + r * 0.22}
        r={r * 0.14}
        fill="#8f2418"
        opacity="0.5"
      />
    </g>
  );
}

function Basil({
  x,
  y,
  rotate = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0C6 -13 21 -15 28 -2C21 11 8 13 0 0Z" fill="#3d7a37" />
      <path
        d="M3 0H24"
        stroke="#2c5c28"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </g>
  );
}

function TomatoSlice({
  cx,
  cy,
  r = 15,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#d8482b" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="#ee7c5b" />
      <g stroke="#f7b49b" strokeWidth="1.4" opacity="0.9">
        <path d={`M${cx - r * 0.55} ${cy}H${cx + r * 0.55}`} />
        <path d={`M${cx} ${cy - r * 0.55}V${cy + r * 0.55}`} />
        <path
          d={`M${cx - r * 0.38} ${cy - r * 0.38}L${cx + r * 0.38} ${cy + r * 0.38}`}
        />
        <path
          d={`M${cx + r * 0.38} ${cy - r * 0.38}L${cx - r * 0.38} ${cy + r * 0.38}`}
        />
      </g>
    </g>
  );
}

function Olive({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="6.5" fill="#3f3448" />
      <circle cx={cx} cy={cy} r="2.6" fill="#6f5d7d" />
    </g>
  );
}

function PepperStrip({
  x,
  y,
  rotate = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <rect x={x - 11} y={y - 4} width="22" height="8" rx="4" fill="#4d8a3c" />
      <rect
        x={x - 7}
        y={y - 1.5}
        width="14"
        height="3"
        rx="1.5"
        fill="#6aa84f"
      />
    </g>
  );
}

function Mozzarella({ cx, cy, r = 11 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#fffaf0"
        stroke="#eadfc7"
        strokeWidth="1.5"
      />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#f6ecd8" />
    </g>
  );
}

function Sausage({ cx, cy, r = 10 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#8a4a2c" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.16} fill="#5c2d18" />
      <circle cx={cx + r * 0.32} cy={cy + r * 0.26} r={r * 0.13} fill="#5c2d18" />
      <circle cx={cx + r * 0.1} cy={cy - r * 0.42} r={r * 0.1} fill="#a56745" />
    </g>
  );
}

function Chicken({
  x,
  y,
  rotate = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <rect x={x - 10} y={y - 7} width="20" height="14" rx="5" fill="#e6bf83" />
      <path
        d={`M${x - 6} ${y - 2.5}H${x + 6} M${x - 6} ${y + 2.5}H${x + 6}`}
        stroke="#c89a58"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Onion({
  x,
  y,
  rotate = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <path
      d={`M${x - 14} ${y + 4} Q${x} ${y - 16} ${x + 14} ${y + 4}`}
      transform={`rotate(${rotate} ${x} ${y})`}
      fill="none"
      stroke="#9c5c8c"
      strokeLinecap="round"
      strokeWidth="4.5"
    />
  );
}

function Bacon({
  x,
  y,
  rotate = 0,
}: {
  x: number;
  y: number;
  rotate?: number;
}) {
  return (
    <g transform={`rotate(${rotate} ${x} ${y})`}>
      <rect x={x - 13} y={y - 5} width="26" height="10" rx="3" fill="#b4522f" />
      <path
        d={`M${x - 10} ${y - 2}H${x + 10} M${x - 10} ${y + 2}H${x + 10}`}
        stroke="#d98a62"
        strokeWidth="2"
      />
    </g>
  );
}
