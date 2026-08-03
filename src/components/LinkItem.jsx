import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

function LinkItem({ link, darkMode }) {
  return (
    <div
      className={`flex items-center justify-between p-4 transition ${
        darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
      }`}
    >
      <div className="min-w-0 flex-1 pr-4">
        <p
          className={`truncate font-bold ${
            darkMode ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {link.text}
        </p>

        <p className="mt-0.5 truncate text-xs text-blue-400">{link.href}</p>
      </div>

      <div
        className={`flex shrink-0 items-center gap-1 rounded-lg border px-4 py-1.5 text-[10px] font-black uppercase ${
          link.isNoFollow
            ? "border-amber-900/30 bg-amber-900/20 text-amber-500"
            : "border-emerald-900/30 bg-emerald-900/20 text-emerald-500"
        }`}
      >
        {link.isNoFollow ? (
          <IoCloseCircleOutline size={14} />
        ) : (
          <IoCheckmarkCircleOutline size={14} />
        )}

        {link.isNoFollow ? "Nofollow" : "Dofollow"}
      </div>
    </div>
  );
}

export default LinkItem;
