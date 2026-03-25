import type { Category } from '../data/cards';
import { CATEGORY_COLORS } from '../data/cards';

interface Props {
  category: Category;
}

export function CategoryPill({ category }: Props) {
  const { solid, tint } = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 4px',
        borderRadius: '4px',
        background: tint,
        width: 'fit-content',
        color: solid,
        fontFamily: "'DM Mono', monospace",
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {category}
    </span>
  );
}
