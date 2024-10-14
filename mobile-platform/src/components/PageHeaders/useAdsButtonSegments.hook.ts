import { useMemo, useState } from 'react';

import { describeArc } from '@utils/math';

const SEGMENT_STROKE_WIDTH = 8;
const EMPTY_SEGMENT_STROKE_WIDTH = 6;
const SEGMENT_GAP = 26;
type Arguments = {
  maxSegments: number;
  segmentAmount: number;
};

type HookResult = {
  segments: string[];
  emptySegment: string;
};

export const useAdsButtonSegments = ({
  maxSegments,
  segmentAmount,
}: Arguments): HookResult => {
  const [segmentLength, setSegmentLength] = useState(0);

  const segments = useMemo(() => {
    setSegmentLength((360 - maxSegments * SEGMENT_GAP) / maxSegments);
    const s = [];

    for (let i = 0; i < segmentAmount; i++) {
      const startAngle = i * (segmentLength + SEGMENT_GAP);
      const endAngle = startAngle + segmentLength;
      s.push(describeArc(50, 50, 50 - SEGMENT_STROKE_WIDTH / 2, startAngle, endAngle));
    }

    return s;
  }, [maxSegments, segmentAmount, segmentLength]);

  const emptySegment = useMemo(() => {
    const emptySegmentStartAngle = (segmentLength + SEGMENT_GAP) * segmentAmount;
    const emptySegmentEndAngle = 360 - SEGMENT_GAP;

    return describeArc(
      50,
      50,
      50 - EMPTY_SEGMENT_STROKE_WIDTH / 2,
      emptySegmentStartAngle,
      emptySegmentEndAngle,
    );
  }, [segmentAmount, segmentLength]);

  return { segments, emptySegment };
};
