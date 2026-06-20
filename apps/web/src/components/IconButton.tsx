import type { ReactNode } from 'react';

interface Props {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function IconButton({ label, icon, active, onClick }: Props) {
  return (
    <button className={`icon-button${active ? ' is-active' : ''}`} onClick={onClick} type="button">
      <span className="icon-button__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="icon-button__label">{label}</span>
    </button>
  );
}
