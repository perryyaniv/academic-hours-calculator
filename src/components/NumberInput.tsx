interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  inputClassName?: string;
}

export function NumberInput({
  value,
  min,
  max,
  step = 1,
  onChange,
  className = '',
  inputClassName = '',
}: Props) {
  const decrement = () => {
    const next = Math.round((value - step) * 1000) / 1000;
    if (min === undefined || next >= min) onChange(next);
  };

  const increment = () => {
    const next = Math.round((value + step) * 1000) / 1000;
    if (max === undefined || next <= max) onChange(next);
  };

  const canDec = min === undefined || value - step >= min - 0.001;
  const canInc = max === undefined || value + step <= max + 0.001;

  return (
    <div
      dir="ltr"
      className={`flex items-stretch border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-bb-green focus-within:border-bb-green ${className}`}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={!canDec}
        className="w-10 shrink-0 flex items-center justify-center text-gray-500
          hover:bg-gray-100 active:bg-gray-200
          disabled:opacity-25 disabled:cursor-not-allowed
          transition-colors text-xl font-light select-none"
        aria-label="הפחת"
      >
        −
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(v);
        }}
        className={`flex-1 text-center border-x border-gray-200 py-2 text-sm
          font-semibold text-gray-800 bg-white focus:outline-none
          no-spinner min-w-0 ${inputClassName}`}
      />

      <button
        type="button"
        onClick={increment}
        disabled={!canInc}
        className="w-10 shrink-0 flex items-center justify-center text-bb-green
          hover:bg-bb-green/10 active:bg-bb-green/20
          disabled:opacity-25 disabled:cursor-not-allowed
          transition-colors text-xl font-light select-none"
        aria-label="הוסף"
      >
        +
      </button>
    </div>
  );
}
