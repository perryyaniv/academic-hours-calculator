interface Props {
  onReset: () => void;
}

export function Header({ onReset }: Props) {
  return (
    <header className="bg-bb-green rounded-xl shadow-md overflow-hidden mb-1">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          {/* Official Beit Berl circular logo */}
          <img
            src="/logo.jpg"
            alt="המכללה האקדמית בית ברל"
            className="h-14 w-14 rounded-full object-cover"
          />
          <button
            onClick={onReset}
            className="btn-ghost text-xs opacity-70 hover:opacity-100"
          >
            אפס הכל
          </button>
        </div>
        <div className="border-t border-white/20 pt-3">
          <h1 className="text-white text-xl font-bold leading-tight">
            בית ברל — מחשבון תכנית לימודים
          </h1>
          <p className="text-white/70 text-xs mt-0.5">
            חישוב שעות אקדמיות לפי מפגשים
          </p>
        </div>
      </div>
      <div className="h-1 bg-bb-yellow" />
    </header>
  );
}
