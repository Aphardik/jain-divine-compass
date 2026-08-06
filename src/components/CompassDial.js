import React from 'react';
import Svg, { Circle, Defs, G, Line, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import { toRad } from '../geo';

export default function CompassDial({ size, bearing, aligned, colors }) {
  const r = size / 2;
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const angle = i * 5;
    const isMajor = angle % 90 === 0;
    const isMid = angle % 30 === 0;
    const len = isMajor ? 20 : isMid ? 13 : 6;
    const rad = toRad(angle);
    const x1 = r + (r - 14) * Math.sin(rad);
    const y1 = r - (r - 14) * Math.cos(rad);
    const x2 = r + (r - 14 - len) * Math.sin(rad);
    const y2 = r - (r - 14 - len) * Math.cos(rad);
    ticks.push(
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? colors.tickMajor : isMid ? colors.tickMid : colors.tickMinor}
        strokeWidth={isMajor ? 2.5 : isMid ? 1.6 : 1}
      />
    );
  }

  const degLabels = [];
  for (let a = 0; a < 360; a += 30) {
    if (a % 90 === 0) continue;
    const rad = toRad(a);
    const x = r + (r - 46) * Math.sin(rad);
    const y = r - (r - 46) * Math.cos(rad);
    degLabels.push(
      <SvgText
        key={`deg-${a}`}
        x={x}
        y={y + 4}
        fontSize={11}
        fill={colors.degLabel}
        textAnchor="middle"
        transform={`rotate(${a}, ${x}, ${y})`}
      >
        {a}
      </SvgText>
    );
  }

  const cardinals = [
    { label: 'N', angle: 0, color: colors.cardinalN },
    { label: 'E', angle: 90, color: colors.gold },
    { label: 'S', angle: 180, color: colors.gold },
    { label: 'W', angle: 270, color: colors.gold },
  ];

  const pipRad = toRad(bearing);
  const pipX = r + (r - 30) * Math.sin(pipRad);
  const pipY = r - (r - 30) * Math.cos(pipRad);

  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="dialBg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.dialStops[0]} />
          <Stop offset="78%" stopColor={colors.dialStops[1]} />
          <Stop offset="100%" stopColor={colors.dialStops[2]} />
        </RadialGradient>
      </Defs>

      <Circle cx={r} cy={r} r={r - 2} fill="url(#dialBg)" stroke={colors.ringStroke} strokeWidth={3} />
      <Circle cx={r} cy={r} r={r - 10} fill="none" stroke={colors.innerStroke} strokeWidth={1} />
      <Circle cx={r} cy={r} r={r - 62} fill="none" stroke={colors.centerRingStroke} strokeWidth={1} />

      <G opacity={0.3}>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 360) / 24;
          const rad = toRad(a);
          const x = r + (r - 74) * Math.sin(rad);
          const y = r - (r - 74) * Math.cos(rad);
          return <Circle key={`petal-${i}`} cx={x} cy={y} r={2.5} fill={colors.petal} />;
        })}
      </G>

      {ticks}
      {degLabels}

      {cardinals.map(({ label, angle, color }) => {
        const rad = toRad(angle);
        const x = r + (r - 40) * Math.sin(rad);
        const y = r - (r - 40) * Math.cos(rad);
        return (
          <SvgText
            key={label}
            x={x}
            y={y + 8}
            fontSize={label === 'N' ? 24 : 18}
            fontWeight="bold"
            fill={color}
            textAnchor="middle"
            transform={`rotate(${angle}, ${x}, ${y})`}
          >
            {label}
          </SvgText>
        );
      })}

      <Circle cx={pipX} cy={pipY} r={9} fill={aligned ? colors.align : colors.goldBright} opacity={0.28} />
      <Circle
        cx={pipX}
        cy={pipY}
        r={5}
        fill={aligned ? colors.align : colors.goldBright}
        stroke={colors.dialStops[1]}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
