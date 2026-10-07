import { CalendarDays, Clock3, ListTodo } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Today", icon: CalendarDays },
  { to: "/activities", label: "Activities", icon: ListTodo },
  { to: "/history", label: "History", icon: Clock3 },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl justify-around px-4 py-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-20 flex-col items-center gap-1 text-xs font-medium ${
                isActive ? "text-emerald-700" : "text-stone-400"
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}