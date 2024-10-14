import { useMemo, useState } from 'react';

import { EMPTY_SEGMENT_STROKE_WIDTH, SEGMENT_GAP, SEGMENT_STROKE_WIDTH } from '../types';

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

interface Props {
  maxSegments: number;
  numSegments: number;
}

interface HookResult {
  segments: string[];
  emptySegment: string;
}

export function useButtonIconSegments({ maxSegments, numSegments }: Props): HookResult {
  const [segmentLength, setSegmentLength] = useState(0);

  const segments = useMemo(() => {
    setSegmentLength((360 - maxSegments * SEGMENT_GAP) / maxSegments);
    const segments = [];

    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * (segmentLength + SEGMENT_GAP);
      const endAngle = startAngle + segmentLength;
      segments.push(
        describeArc(50, 50, 50 - SEGMENT_STROKE_WIDTH / 2, startAngle, endAngle),
      );
    }

    return segments;
  }, [maxSegments, numSegments, segmentLength]);

  const emptySegment = useMemo(() => {
    const emptySegmentStartAngle = (segmentLength + SEGMENT_GAP) * numSegments;
    const emptySegmentEndAngle = 360 - SEGMENT_GAP;

    return describeArc(
      50,
      50,
      50 - EMPTY_SEGMENT_STROKE_WIDTH / 2,
      emptySegmentStartAngle,
      emptySegmentEndAngle,
    );
  }, [numSegments, segmentLength]);

  return { segments, emptySegment };
}
