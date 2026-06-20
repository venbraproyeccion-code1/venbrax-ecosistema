import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  children?: ReactNode;
}

export function StepCard({ title, description, children }: Props) {
  return (
    <section className="step-card">
      <div className="step-card__head">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="step-card__body">{children}</div>
    </section>
  );
}
