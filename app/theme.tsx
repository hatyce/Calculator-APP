"use client";
import { useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.style.setProperty("--background", "#ffffff");
      document.documentElement.style.setProperty("--foreground", "#171717");
    } else {
      document.documentElement.style.setProperty("--background", "#0a0a0a");
      document.documentElement.style.setProperty("--foreground", "#ededed");
    }
  };

  return (
    <div>
      <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        backgroundColor: theme === "light" ? "#fbbf24" : "#4b5563",
      }}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      />
      <span className="absolute left-2 top-1 text-xs">{theme === "light" ? "🌞" : "🌙"}</span>
    </button>
      {children}
    </div>
  );
}

