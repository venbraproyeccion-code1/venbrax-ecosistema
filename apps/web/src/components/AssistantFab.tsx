interface Props {
  onOpen: () => void;
  pulse?: boolean;
}

export function AssistantFab({ onOpen, pulse }: Props) {
  return (
    <button className={`assistant-fab${pulse ? ' is-pulse' : ''}`} type="button" onClick={onOpen}>
      <span>Chat</span>
      <strong>Asistente</strong>
    </button>
  );
}
