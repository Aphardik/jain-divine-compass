import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Rect } from 'react-native-svg';

// Self-contained stylised Jain temple-skyline silhouette — used in place of a
// real photograph (milestone icon + prayer-overlay backdrop) so the app
// carries no external/bundled image assets for tirth artwork.
export default function TempleGlyph({ size = 96, color = '#caa24a', style }) {
  return (
    <Svg width={size} height={size * (200 / 240)} viewBox="0 0 240 200" style={style}>
      {/* base platform */}
      <Rect x={16} y={172} width={208} height={12} rx={2} fill={color} opacity={0.9} />

      {/* left turret */}
      <Rect x={40} y={122} width={30} height={50} fill={color} opacity={0.85} />
      <Circle cx={55} cy={122} r={15} fill={color} opacity={0.85} />
      <Rect x={52} y={97} width={6} height={16} fill={color} opacity={0.85} />

      {/* right turret */}
      <Rect x={170} y={122} width={30} height={50} fill={color} opacity={0.85} />
      <Circle cx={185} cy={122} r={15} fill={color} opacity={0.85} />
      <Rect x={182} y={97} width={6} height={16} fill={color} opacity={0.85} />

      {/* central shikhara — stacked tiers narrowing upward */}
      <Polygon points="80,172 160,172 150,132 90,132" fill={color} />
      <Polygon points="95,132 145,132 138,97 102,97" fill={color} />
      <Polygon points="105,97 135,97 128,67 112,67" fill={color} />
      <Polygon points="114,67 126,67 120,42" fill={color} />

      {/* kalash + flag pinnacle */}
      <Circle cx={120} cy={36} r={6} fill={color} />
      <Line x1={120} y1={30} x2={120} y2={16} stroke={color} strokeWidth={2} />
      <Path d="M120,17 L133,21 L120,25 Z" fill={color} />

      {/* doorway */}
      <Rect
        x={108}
        y={150}
        width={24}
        height={22}
        rx={12}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.9}
      />
    </Svg>
  );
}
