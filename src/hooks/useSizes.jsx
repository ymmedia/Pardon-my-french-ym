import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../constants/breakpoints';

const {
  sm, md, lg, xl, xxl,
} = breakpoints;

export const VerySmall = ({ children }) => {
  const isVerySmall = useMediaQuery({
    maxWidth: sm - 1,
  });

  return isVerySmall ? children : null;
};

export const Small = ({ children }) => {
  const isSmall = useMediaQuery({
    minWidth: sm,
  });

  return isSmall ? children : null;
};

export const Medium = ({ children }) => {
  const isMedium = useMediaQuery({
    minWidth: md,
  });

  return isMedium ? children : null;
};

export const Large = ({ children }) => {
  const isLarge = useMediaQuery({
    minWidth: lg,
  });

  return isLarge ? children : null;
};

export const XLarge = ({ children }) => {
  const isXLarge = useMediaQuery({
    minWidth: xl,
  });

  return isXLarge ? children : null;
};

export const XXLarge = ({ children }) => {
  const isXXLarge = useMediaQuery({
    minWidth: xxl,
  });

  return isXXLarge ? children : null;
};

const useSizes = () => {
  const isVerySmall = useMediaQuery({
    maxWidth: sm - 1,
  });

  const isSmall = useMediaQuery({
    minWidth: sm,
  });

  const isMedium = useMediaQuery({
    minWidth: md,
  });

  const isLarge = useMediaQuery({
    minWidth: lg,
  });

  const isXLarge = useMediaQuery({
    minWidth: xl,
  });

  const isXXLarge = useMediaQuery({
    minWidth: xxl,
  });

  return {
    isVerySmall,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isXXLarge,
  };
};

export default useSizes;
