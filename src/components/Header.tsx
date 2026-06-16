interface Props {
  onReset: () => void;
  onShare: () => void;
  copyFeedback: boolean;
}

export function Header({ onReset, onShare, copyFeedback }: Props) {
  return (
    <header className="bg-bb-green rounded-xl shadow-md overflow-hidden mb-1">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <img
            src="/logo.jpg"
            alt="המכללה האקדמית בית ברל"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className={`btn-ghost text-xs flex items-center gap-1.5 transition-all ${
                copyFeedback ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {copyFeedback ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  הועתק!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  שתף
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="btn-ghost text-xs opacity-70 hover:opacity-100"
            >
              אפס
            </button>
          </div>
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
