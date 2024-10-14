import { useMountEffect } from '@noice-com/common-react-core';
import { useLocation } from 'react-router';

export const useScrollToElementByAnchorHash = () => {
  const { hash } = useLocation();
  useScrollToElementByElementId(hash.slice(1));
};

export const useScrollToElementByElementId = (id: string, skip?: boolean) => {
  useMountEffect(() => {
    if (skip) {
      return;
    }

    const offsetTop = document.getElementById(id)?.getBoundingClientRect().top;

    if (offsetTop) {
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
};
