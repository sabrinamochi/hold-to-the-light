import type { Category } from '../data/cards';
import { CATEGORY_COLORS } from '../data/cards';

interface Props {
  category: Category;
}

export function CategoryPill({ category }: Props) {
  const { solid } = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 0px',
        borderRadius: '4px',
        background: 'transparent',
        border: `1px solid ${solid}55`,
        width: 'fit-content',
        color: solid,
        fontFamily: "'Nunito Sans', sans-serif",
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
