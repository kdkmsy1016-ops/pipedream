declare module 'react-pageflip' {
  import * as React from 'react';

  export interface PageFlipProps {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startPage?: number;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: 'portrait' | 'landscape' }) => void;
    onChangeState?: (e: { data: 'user_fold' | 'fold_corner' | 'flipping' | 'read' }) => void;
    renderOnlyVisible?: boolean;
    showCover?: boolean;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<
    PageFlipProps & React.RefAttributes<any>
  >;

  export default HTMLFlipBook;
}
