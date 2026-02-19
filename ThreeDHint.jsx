import React from 'react';
import { Text, Float } from '@react-three/drei';

export function ThreeDHint({ hint, visible }) {
  if (!visible) return null;

  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        fontSize={0.5}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8p-8ad8z076Y2Ma29vhc.woff"
      >
        {hint}
      </Text>
    </Float>
  );
}