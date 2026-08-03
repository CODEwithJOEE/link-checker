import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("obi-link-hunter-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem("obi-link-hunter-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return {
    darkMode,
    toggleDarkMode: () => setDarkMode((current) => !current),
  };
}
