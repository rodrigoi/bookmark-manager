const isManaging = false;
const onManageClick = () => {};

export function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">→</span>
        <h1 className="text-lg uppercase">Bookmarks</h1>
      </div>
      <button
        className={`border px-4 py-1 text-sm hover:bg-gray-100 ${
          isManaging ? "bg-gray-100" : ""
        }`}
      >
        MANAGE
      </button>
    </header>
  );
}
