declare module 'react-highlight-words' {
  import type { ComponentType, ReactNode } from 'react';

  type HighlightTagProps = {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  };

  type HighlighterProps = {
    activeClassName?: string;
    activeIndex?: number;
    activeStyle?: React.CSSProperties;
    autoEscape?: boolean;
    caseSensitive?: boolean;
    className?: string;
    findChunks?: (...args: unknown[]) => Array<{ end: number; highlight: boolean; start: number }>;
    highlightClassName?: string;
    highlightStyle?: React.CSSProperties;
    highlightTag?: keyof JSX.IntrinsicElements | ComponentType<HighlightTagProps>;
    sanitize?: (text: string) => string;
    searchWords: string[];
    textToHighlight: string;
    unhighlightClassName?: string;
    unhighlightStyle?: React.CSSProperties;
  };

  const Highlighter: ComponentType<HighlighterProps>;

  export default Highlighter;
}
