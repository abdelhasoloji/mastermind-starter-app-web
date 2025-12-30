type Props = {
  onTrigger: () => void;
  disabled?: boolean;
};

export function JobTrigger({ onTrigger, disabled }: Props) {
  return (
    <button onClick={onTrigger} disabled={disabled}>
      Lancer le traitement
    </button>
  );
}
