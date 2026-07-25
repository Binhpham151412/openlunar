import { useState, useEffect, useMemo } from "react";
import { Settings, Calculator, Sparkles, BookOpen } from "lucide-react";
import { OCCASIONS, RULES } from "./lib/rules";
import { getKimLau, getTamTai, getHoangOc } from "./lib/ageRules";
import { buildMonthGrid, sameDate, dateKey } from "./lib/dateUtils";
import { scoreDay } from "./lib/dayScore";
import { storage } from "./lib/storage";
import Calendar from "./components/Calendar";
import DayDetailDrawer from "./components/DayDetailDrawer";
import TrungTangTool from "./components/TrungTangTool";
import SettingsModal from "./components/SettingsModal";
import UpcomingGoodDays from "./components/UpcomingGoodDays";
import SourcesModal from "./components/SourcesModal";

export default function App() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [occasion, setOccasion] = useState("cuoi");
  const [birthYear, setBirthYear] = useState("");
  const [enabledRules, setEnabledRules] = useState(() =>
    RULES.reduce((acc, r) => ({ ...acc, [r.id]: true }), {})
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTrungTang, setShowTrungTang] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showSources, setShowSources] = useState(false);
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
    });
    storage.set("settings", payload).catch(() => {});
  }, [birthYear, occasion, enabledRules, loaded]);

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

  const showAgeInput = occasion === "cuoi" || occasion === "nha";
  const kimLau = showAgeInput && birthYear ? getKimLau(Number(birthYear), year) : null;
  const tamTai = showAgeInput && birthYear ? getTamTai(Number(birthYear), year) : false;
  const hoangOc = occasion === "nha" && birthYear ? getHoangOc(Number(birthYear), year) : null;

  const selected = selectedCell ? cellData.find((c) => sameDate(c.date, selectedCell)) : null;

  const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label;

  return (
    <div className="xn-root">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="xn-serif text-2xl font-bold tracking-tight">Xem Ngày Tốt Xấu</h1>
          <p className="text-xs xn-mono" style={{ color: "var(--ink-soft)" }}>
            Lịch âm dương · Can Chi · Trực · Sao Hoàng Đạo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="xn-card xn-btn-ghost p-2 rounded-full"
            onClick={() => setShowUpcoming(true)}
            aria-label="Tìm ngày tốt sắp tới"
            title="Tìm ngày tốt sắp tới"
          >
            <Sparkles size={20} />
          </button>
          <button
            className="xn-card xn-btn-ghost p-2 rounded-full"
            onClick={() => setShowTrungTang(true)}
            aria-label="Công cụ tính Trùng Tang"
            title="Tính Trùng Tang"
          >
            <Calculator size={20} />
          </button>
          <button
            className="xn-card xn-btn-ghost p-2 rounded-full"
            onClick={() => setShowSources(true)}
            aria-label="Nguồn tham khảo"
            title="Nguồn tham khảo"
          >
            <BookOpen size={20} />
          </button>
          <button
            className="xn-card xn-btn-ghost p-2 rounded-full"
            onClick={() => setShowSettings(true)}
            aria-label="Cài đặt yếu tố"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Occasion chips */}
      <div className="max-w-5xl mx-auto px-4 pb-2">
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
      </div>

      {/* Birth year input + Kim Lâu / Tam Tai / Hoang Ốc banner */}
      {showAgeInput && (
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="xn-card p-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
              Năm sinh gia chủ (tuỳ chọn, để xét {occasion === "nha" ? "Kim Lâu / Tam Tai / Hoang Ốc" : "Kim Lâu / Tam Tai"}):
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
            {birthYear && (kimLau || tamTai || (hoangOc && !hoangOc.good)) && (
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
            {birthYear && !kimLau && !tamTai && !(hoangOc && !hoangOc.good) && (
              <span className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>
                Không phạm Kim Lâu / Tam Tai{occasion === "nha" ? " / Hoang Ốc" : ""} trong năm {year} (cách tính gần đúng)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="max-w-5xl mx-auto px-4">
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
      </div>

      {/* Detail drawer */}
      {selected && (
        <DayDetailDrawer
          selected={selected}
          occasion={occasion}
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
          onPickDate={(date) => {
            setViewDate(date);
            setSelectedCell(date);
            setShowUpcoming(false);
          }}
          onClose={() => setShowUpcoming(false)}
        />
      )}

      {/* Trùng Tang tool */}
      {showTrungTang && <TrungTangTool onClose={() => setShowTrungTang(false)} />}

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          enabledRules={enabledRules}
          onToggleRule={(id) => setEnabledRules((prev) => ({ ...prev, [id]: !prev[id] }))}
          onImportBackup={(data) => {
            if (data.settings) {
              if (data.settings.birthYear) setBirthYear(String(data.settings.birthYear));
              if (data.settings.occasion) setOccasion(data.settings.occasion);
              if (data.settings.enabledRules) setEnabledRules((prev) => ({ ...prev, ...data.settings.enabledRules }));
            }
            if (data.favorites) setFavorites(data.favorites);
            if (data.notes) setNotes(data.notes);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Nguồn tham khảo */}
      {showSources && <SourcesModal onClose={() => setShowSources(false)} />}
    </div>
  );
}
