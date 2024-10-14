import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface HookResult {
  isTruncated: boolean;
  isShowingMore: boolean;
  descriptionRef: RefObject<HTMLDivElement>;
  showMore: () => void;
  showLess: () => void;
}

export function useTruncatedDescription(): HookResult {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleTruncate = useCallback(() => {
    if (!descriptionRef.current) {
      return;
    }
    const { offsetHeight, scrollHeight } = descriptionRef.current;
    setIsTruncated(offsetHeight < scrollHeight);
  }, []);

  useLayoutEffect(() => {
    handleTruncate();
  }, [handleTruncate]);

  useEffect(() => {
    window.addEventListener('resize', handleTruncate);

    return () => {
      window.removeEventListener('resize', handleTruncate);
    };
  }, [handleTruncate]);

  const showMore = () => setIsShowingMore(true);
  const showLess = () => {
    setIsShowingMore(false);
    setIsTruncated(true);
  };

  return {
    isTruncated,
    descriptionRef,
    isShowingMore,
    showMore,
    showLess,
  };
}
