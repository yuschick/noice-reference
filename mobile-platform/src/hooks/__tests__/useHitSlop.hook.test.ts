import { renderHook, act } from '@testing-library/react-hooks';
import { LayoutChangeEvent } from 'react-native';

import { useHitSlop } from '@hooks/useHitSlop.hook';

describe('useHitSlop hook', () => {
  it('should initialize with correct default hit slop', () => {
    const { result } = renderHook(() => useHitSlop());
    const [hitSlop] = result.current;

    expect(hitSlop).toEqual({ top: 22, bottom: 22, left: 22, right: 22 });
  });

  it('should update hit slop correctly when layout changes', () => {
    const { result } = renderHook(() => useHitSlop());
    const [, onLayout] = result.current;

    const layoutChangeEvent = {
      nativeEvent: {
        layout: {
          width: 30,
          height: 30,
        },
      },
    };

    act(() => {
      onLayout(layoutChangeEvent as LayoutChangeEvent);
    });

    const [updatedHitSlop] = result.current;

    expect(updatedHitSlop).toEqual({ top: 7, bottom: 7, left: 7, right: 7 });
  });

  it('should not update hit slop if layout dimensions do not change', () => {
    const { result } = renderHook(() => useHitSlop());
    const [, onLayout] = result.current;

    const initialHitSlop = result.current[0];

    const layoutChangeEvent = {
      nativeEvent: {
        layout: {
          width: 0,
          height: 0,
        },
      },
    };

    act(() => {
      onLayout(layoutChangeEvent as LayoutChangeEvent);
    });

    const [unchangedHitSlop] = result.current;

    expect(unchangedHitSlop).toEqual(initialHitSlop);
  });

  it('should update hit slop to 0 if width and height are greater than or equal to 44', () => {
    const { result } = renderHook(() => useHitSlop());
    const [, onLayout] = result.current;

    const layoutChangeEvent = {
      nativeEvent: {
        layout: {
          width: 44,
          height: 44,
        },
      },
    };

    act(() => {
      onLayout(layoutChangeEvent as LayoutChangeEvent);
    });

    const [updatedHitSlop] = result.current;

    expect(updatedHitSlop).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });
});
