import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export default function Needle({ size, aligned, colors }) {
  const r = size / 2;
  const tipLen = r - 40;
  const tailLen = r * 0.34;
  const tip = aligned ? colors.align : colors.needleTip;
  const tip2 = aligned ? '#3fae74' : colors.needleTip2;
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={tip} />
          <Stop offset="100%" stopColor={tip2} />
        </LinearGradient>
      </Defs>
      <Path
        d={`M ${r} ${r - tipLen}
            L ${r - 10} ${r - tipLen + 30}
            L ${r} ${r - 8}
            L ${r + 10} ${r - tipLen + 30}
            Z`}
        fill="url(#needleGrad)"
        stroke={colors.needleTail}
        strokeWidth={1}
      />
      <Path
        d={`M ${r} ${r + tailLen}
            L ${r - 6} ${r + 8}
            L ${r} ${r + 16}
            L ${r + 6} ${r + 8}
            Z`}
        fill={colors.needleTail}
      />
    </Svg>
  );
}
