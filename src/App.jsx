import { useState, useEffect, useMemo } from "react";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { OCCASIONS, RULES } from "./lib/rules";
import { getKimLau, getTamTai, getHoangOc } from "./lib/ageRules";
import { buildMonthGrid, sameDate, dateKey } from "./lib/dateUtils";
import { scoreDay } from "./lib/dayScore";
import { storage } from "./lib/storage";
import Calendar from "./components/Calendar";
import DayDetailDrawer from "./components/DayDetailDrawer";
import TrungTangTool from "./components/TrungTangTool";
import SettingsSection from "./components/SettingsSection";
import UpcomingGoodDays from "./components/UpcomingGoodDays";
import SourcesSection from "./components/SourcesSection";
import MenhTool from "./components/MenhTool";
import CompatibilityTool from "./components/CompatibilityTool";
import HuongNhaTool from "./components/HuongNhaTool";
import SaoHanTool from "./components/SaoHanTool";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [theme, setTheme] = useState("light");
  const [occasion, setOccasion] = useState("cuoi");
  const [birthYear, setBirthYear] = useState("");
  const [enabledRules, setEnabledRules] = useState(() =>
    RULES.reduce((acc, r) => ({ ...acc, [r.id]: true }), {})
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [activeSection, setActiveSection] = useState("lich");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [notes, setNotes] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await storage.get("settings");
        if (res && res.value && mounted) {
          const parsed = JSON.parse(res.value);
          if (parsed.birthYear) setBirthYear(String(parsed.birthYear));
          if (parsed.occasion) setOccasion(parsed.occasion);
          if (parsed.enabledRules) setEnabledRules((prev) => ({ ...prev, ...parsed.enabledRules }));
          if (parsed.theme) setTheme(parsed.theme);
        }
      } catch {
        /* chưa có dữ liệu lưu trước đó — dùng mặc định */
      }
      try {
        const favRes = await storage.get("favorites");
        if (favRes && favRes.value && mounted) setFavorites(JSON.parse(favRes.value));
      } catch {
        /* chưa có dữ liệu lưu trước đó */
      }
      try {
        const notesRes = await storage.get("notes");
        if (notesRes && notesRes.value && mounted) setNotes(JSON.parse(notesRes.value));
      } catch {
        /* chưa có dữ liệu lưu trước đó */
      }
      if (mounted) setLoaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const payload = JSON.stringify({
      birthYear: birthYear ? Number(birthYear) : null,
      occasion,
      enabledRules,
      theme,
    });
    storage.set("settings", payload).catch(() => {});
  }, [birthYear, occasion, enabledRules, theme, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("favorites", JSON.stringify(favorites)).catch(() => {});
  }, [favorites, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("notes", JSON.stringify(notes)).catch(() => {});
  }, [notes, loaded]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const cellData = useMemo(
    () =>
      cells.map((c) => {
        const key = dateKey(c.date);
        return {
          ...c,
          ...scoreDay(c.date, occasion, enabledRules),
          favorite: !!favorites[key],
          note: notes[key] || "",
        };
      }),
    [cells, enabledRules, occasion, favorites, notes]
  );

  const showAgeInput = occasion === "cuoi" || occasion === "nha" || occasion === "nhaptrach";
  const showHoangOc = occasion === "nha" || occasion === "nhaptrach";
  const kimLau = showAgeInput && birthYear ? getKimLau(Number(birthYear), year) : null;
  const tamTai = showAgeInput && birthYear ? getTamTai(Number(birthYear), year) : false;
  const hoangOc = showHoangOc && birthYear ? getHoangOc(Number(birthYear), year) : null;

  const selected = selectedCell ? cellData.find((c) => sameDate(c.date, selectedCell)) : null;

  const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label;

  const themeToggleBtn = (
    <button
      className="xn-card xn-btn-ghost p-2 rounded-full"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  return (
    <div className="xn-root" data-theme={theme}>
      <div className="md:flex">
        {/* Sidebar - desktop */}
        <aside
          className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 p-4"
          style={{ borderRight: "1px solid var(--line)" }}
        >
          <h1 className="xn-serif text-xl font-bold tracking-tight mb-1">Xem Ngày Tốt Xấu</h1>
          <p className="text-xs xn-mono mb-4" style={{ color: "var(--ink-soft)" }}>
            Lịch âm dương · Phong thủy
          </p>
          <Sidebar active={activeSection} onSelect={setActiveSection} />
        </aside>

        {/* Sidebar - mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={() => setSidebarOpen(false)} />
            <div className="xn-drawer relative w-64 h-full overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="xn-serif text-lg font-bold">Xem Ngày Tốt Xấu</h1>
                <button className="p-1.5 rounded-full xn-btn-ghost" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
                  <X size={18} />
                </button>
              </div>
              <Sidebar
                active={activeSection}
                onSelect={(id) => {
                  setActiveSection(id);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
            <button className="md:hidden p-2 rounded-full xn-btn-ghost" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
              <Menu size={20} />
            </button>
            <h1 className="xn-serif text-lg font-bold md:hidden">Xem Ngày Tốt Xấu</h1>
            <div className="hidden md:block" />
            {themeToggleBtn}
          </div>

          <main className="max-w-5xl mx-auto px-4 py-4">
            {activeSection === "lich" && (
              <>
                {/* Occasion chips */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {OCCASIONS.map((o) => {
                      const Icon = o.icon;
                      const isActive = occasion === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => setOccasion(o.id)}
                          className={`xn-chip ${isActive ? "active" : ""} flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium shrink-0`}
                        >
                          <Icon size={15} />
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="xn-card xn-btn-ghost p-2 rounded-full shrink-0"
                    onClick={() => setShowUpcoming(true)}
                    aria-label="Tìm ngày tốt sắp tới"
                    title="Tìm ngày tốt sắp tới"
                  >
                    <Sparkles size={20} />
                  </button>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--ink-soft)" }}>
                  Lịch bên dưới luôn hiện đủ mọi ngày trong tháng — chọn việc ở trên chỉ đổi{" "}
                  <span style={{ color: "var(--seal)", fontWeight: 600 }}>màu đỏ/vàng</span> để khớp với việc đó,
                  không ẩn ngày nào cả.
                </p>

                {/* Birth year input + Kim Lâu / Tam Tai / Hoang Ốc banner */}
                <div className="xn-card p-3 mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                      <label className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
                        Năm sinh gia chủ (tuỳ chọn
                        {showAgeInput
                          ? `, để xét ${showHoangOc ? "Kim Lâu / Tam Tai / Hoang Ốc" : "Kim Lâu / Tam Tai"}`
                          : ", để xem ngày hợp/xung tuổi khi bấm vào 1 ngày"}
                        ):
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="vd. 1996"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
                        className="xn-mono border rounded-md px-2 py-1 w-28 text-sm"
                        style={{ borderColor: "var(--line)", background: "var(--paper)" }}
                      />
                      {showAgeInput && birthYear && (kimLau || tamTai || (hoangOc && !hoangOc.good)) && (
                        <span className="xn-badge-red text-xs font-semibold px-2 py-1 rounded-full">
                          {[
                            kimLau ? `Phạm ${kimLau.type} (tuổi mụ ${kimLau.tuoiMu})` : null,
                            tamTai ? "Năm Tam Tai" : null,
                            hoangOc && !hoangOc.good ? `Phạm Hoang Ốc: ${hoangOc.type}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                      {showAgeInput && birthYear && !kimLau && !tamTai && !(hoangOc && !hoangOc.good) && (
                        <span className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>
                          Không phạm Kim Lâu / Tam Tai{showHoangOc ? " / Hoang Ốc" : ""} trong năm {year} (cách
                          tính gần đúng)
                        </span>
                      )}
                    </div>
                    {showAgeInput && birthYear && (kimLau || (hoangOc && !hoangOc.good)) && (
                      <ul className="text-xs mt-2 space-y-0.5" style={{ color: "var(--ink-soft)" }}>
                        {kimLau && <li>• {kimLau.type}: {kimLau.meaning}</li>}
                        {hoangOc && !hoangOc.good && <li>• {hoangOc.type}: {hoangOc.meaning}</li>}
                      </ul>
                    )}
                  </div>

                <Calendar
                  year={year}
                  month={month}
                  cellData={cellData}
                  today={today}
                  selectedDate={selectedCell}
                  occasionLabel={occasionLabel}
                  onPrevMonth={() => setViewDate(new Date(year, month - 1, 1))}
                  onNextMonth={() => setViewDate(new Date(year, month + 1, 1))}
                  onChangeMonth={(m) => setViewDate(new Date(year, m, 1))}
                  onChangeYear={(y) => setViewDate(new Date(y, month, 1))}
                  onJumpToday={() => setViewDate(new Date())}
                  onSelectCell={(date) => setSelectedCell(date)}
                />
              </>
            )}

            {activeSection === "trungtang" && <TrungTangTool />}
            {activeSection === "menh" && <MenhTool />}
            {activeSection === "tuoihop" && <CompatibilityTool />}
            {activeSection === "huongnha" && <HuongNhaTool />}
            {activeSection === "saohan" && <SaoHanTool />}
            {activeSection === "nguontk" && <SourcesSection />}
            {activeSection === "caidat" && (
              <SettingsSection
                enabledRules={enabledRules}
                onToggleRule={(id) => setEnabledRules((prev) => ({ ...prev, [id]: !prev[id] }))}
                onImportBackup={(data) => {
                  if (data.settings) {
                    if (data.settings.birthYear) setBirthYear(String(data.settings.birthYear));
                    if (data.settings.occasion) setOccasion(data.settings.occasion);
                    if (data.settings.enabledRules)
                      setEnabledRules((prev) => ({ ...prev, ...data.settings.enabledRules }));
                  }
                  if (data.favorites) setFavorites(data.favorites);
                  if (data.notes) setNotes(data.notes);
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <DayDetailDrawer
          selected={selected}
          occasion={occasion}
          birthYear={birthYear}
          expandedRule={expandedRule}
          onToggleExpand={(id) => setExpandedRule((prev) => (prev === id ? null : id))}
          onToggleFavorite={() => {
            const key = dateKey(selected.date);
            setFavorites((prev) => {
              const next = { ...prev };
              if (next[key]) delete next[key];
              else next[key] = true;
              return next;
            });
          }}
          onChangeNote={(text) => {
            const key = dateKey(selected.date);
            setNotes((prev) => {
              const next = { ...prev };
              if (text) next[key] = text;
              else delete next[key];
              return next;
            });
          }}
          onClose={() => setSelectedCell(null)}
        />
      )}

      {/* Tìm ngày tốt sắp tới */}
      {showUpcoming && (
        <UpcomingGoodDays
          occasion={occasion}
          occasionLabel={occasionLabel}
          enabledRules={enabledRules}
          defaultYear={year}
          defaultMonth={month}
          onPickDate={(date) => {
            setViewDate(date);
            setSelectedCell(date);
            setShowUpcoming(false);
          }}
          onClose={() => setShowUpcoming(false)}
        />
      )}
    </div>
  );
}
