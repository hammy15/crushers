"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  Clock,
  User,
} from "lucide-react";
import { format, addDays, subDays, isToday, isSameDay, getDay } from "date-fns";
import { useDemo } from "@/lib/demo-context";
import { cn } from "@/lib/utils";
import { formatHour, isWithinFacilityHours } from "@/lib/utils";
import type { BayBooking } from "@/types/trackman";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

type ModalAction =
  | { type: "book"; bay: 1 | 2 | 3; date: string; hour: number }
  | { type: "cancel"; booking: BayBooking };

// Bay theme colors
const BAY_THEME = {
  1: { bg: "bg-blue-500", bgLight: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", ring: "ring-blue-200" },
  2: { bg: "bg-violet-500", bgLight: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500", ring: "ring-violet-200" },
  3: { bg: "bg-teal-500", bgLight: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", dot: "bg-teal-500", ring: "ring-teal-200" },
} as const;

export default function SchedulePage() {
  const { bookings, bookSlot, cancelBooking, currentUser } = useDemo();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modal, setModal] = useState<ModalAction | null>(null);
  const [justBooked, setJustBooked] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayOfWeek = getDay(selectedDate);

  // Generate the week strip centered on today
  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i - 3));
  }, []);

  // Bookings for selected day
  const dayBookings = useMemo(
    () => bookings.filter((b) => b.date === dateStr),
    [bookings, dateStr],
  );

  // Bay availability counts for selected day (facility hours only)
  const bayAvailability = useMemo(() => {
    return ([1, 2, 3] as const).map((bay) => {
      const facilityHours = HOURS.filter((h) => isWithinFacilityHours(dayOfWeek, h));
      const booked = dayBookings.filter((b) => b.bayNumber === bay && facilityHours.includes(b.hour)).length;
      return { bay, total: facilityHours.length, booked, open: facilityHours.length - booked };
    });
  }, [dayBookings, dayOfWeek]);

  // My upcoming bookings
  const myUpcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.userId === currentUser.id && b.date >= format(new Date(), "yyyy-MM-dd"))
        .sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour),
    [bookings, currentUser.id],
  );

  // Auto-scroll to current hour
  useEffect(() => {
    const hour = new Date().getHours();
    const el = document.getElementById(`row-${hour}`);
    if (el && scrollRef.current) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, []);

  useEffect(() => {
    if (justBooked) {
      const t = setTimeout(() => setJustBooked(null), 600);
      return () => clearTimeout(t);
    }
  }, [justBooked]);

  function getBooking(bay: number, hour: number): BayBooking | undefined {
    return dayBookings.find((b) => b.bayNumber === bay && b.hour === hour);
  }

  function handleSlotClick(bay: 1 | 2 | 3, hour: number) {
    const existing = getBooking(bay, hour);
    if (existing) {
      if (existing.userId === currentUser.id) {
        setModal({ type: "cancel", booking: existing });
      }
      return;
    }
    setModal({ type: "book", bay, date: dateStr, hour });
  }

  function confirmAction() {
    if (!modal) return;
    if (modal.type === "book") {
      bookSlot(modal.bay, modal.date, modal.hour);
      setJustBooked(`${modal.date}-${modal.bay}-${modal.hour}`);
    } else {
      cancelBooking(modal.booking.id);
    }
    setModal(null);
  }

  // Current time position (percentage through the day for the "now" line)
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowPercent = (nowMinutes / (24 * 60)) * 100;

  return (
    <div>
      {/* Header Row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">Tee Sheet</h1>
          <p className="text-sm text-muted mt-0.5">3 bays · 24/7 booking · $45/hr</p>
        </div>
        {myUpcoming.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-xl px-3 py-2">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">{myUpcoming.length} upcoming</span>
          </div>
        )}
      </motion.div>

      {/* Date Strip — scrollable week pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-5 flex items-center gap-2"
      >
        <button
          onClick={() => setSelectedDate((d) => subDays(d, 1))}
          className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 min-w-max px-0.5">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const dayBookingCount = bookings.filter((b) => b.date === format(day, "yyyy-MM-dd")).length;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[52px] relative",
                    isSelected
                      ? "bg-gradient-to-b from-accent to-orange-500 text-white shadow-lg shadow-accent/20"
                      : isTodayDate
                        ? "bg-accent/5 border border-accent/15 text-foreground hover:bg-accent/10"
                        : "bg-white border border-border text-foreground hover:bg-slate-50",
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    isSelected ? "text-white/70" : "text-muted",
                  )}>
                    {format(day, "EEE")}
                  </span>
                  <span className={cn(
                    "text-lg font-black leading-tight",
                    isSelected ? "text-white" : "",
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayBookingCount > 0 && (
                    <div className={cn(
                      "flex gap-0.5 mt-0.5",
                    )}>
                      {Array.from({ length: Math.min(dayBookingCount, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            isSelected ? "bg-white/60" : "bg-accent/40",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setSelectedDate((d) => addDays(d, 1))}
          className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Bay Availability Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 grid grid-cols-3 gap-3"
      >
        {bayAvailability.map(({ bay, total, booked, open }) => {
          const theme = BAY_THEME[bay as 1 | 2 | 3];
          const pct = Math.round((open / total) * 100);
          return (
            <div
              key={bay}
              className={cn(
                "rounded-xl border p-3 relative overflow-hidden",
                theme.border, theme.bgLight,
              )}
            >
              {/* Fill bar */}
              <div
                className={cn("absolute bottom-0 left-0 h-1 rounded-full opacity-40", theme.bg)}
                style={{ width: `${pct}%` }}
              />
              <div className="flex items-center gap-2 mb-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-full", theme.dot)} />
                <span className="text-xs font-bold">Bay {bay}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-xl font-black", theme.text)}>{open}</span>
                <span className="text-[10px] text-muted">/{total} open</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Timeline Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 bg-white rounded-2xl border border-border overflow-hidden"
      >
        {/* Column Headers */}
        <div className="grid grid-cols-[44px_1fr_1fr_1fr] border-b border-border">
          <div className="p-2" />
          {([1, 2, 3] as const).map((bay) => {
            const theme = BAY_THEME[bay];
            return (
              <div key={bay} className="p-2 text-center border-l border-border">
                <div className="flex items-center justify-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", theme.dot)} />
                  <span className="text-[11px] font-bold">Bay {bay}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Rows */}
        <div className="max-h-[520px] overflow-y-auto relative" ref={scrollRef}>
          {/* Now indicator */}
          {isToday(selectedDate) && (
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${nowPercent}%` }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-sm" />
                <div className="flex-1 h-[2px] bg-red-500/60" />
              </div>
            </div>
          )}

          {HOURS.map((hour) => {
            const isFacility = isWithinFacilityHours(dayOfWeek, hour);
            const isNowHour = isToday(selectedDate) && now.getHours() === hour;

            return (
              <div
                key={hour}
                id={`row-${hour}`}
                className={cn(
                  "grid grid-cols-[44px_1fr_1fr_1fr] border-b border-border/20",
                  !isFacility && "bg-slate-50/40",
                  isNowHour && "bg-red-50/30",
                )}
              >
                {/* Time label */}
                <div className="flex items-center justify-end pr-1.5 py-0">
                  <span
                    className={cn(
                      "text-[10px] font-medium tabular-nums leading-none",
                      isNowHour ? "text-red-500 font-bold" : isFacility ? "text-muted" : "text-muted/40",
                    )}
                  >
                    {formatHour(hour)}
                  </span>
                </div>

                {/* Bay cells */}
                {([1, 2, 3] as const).map((bay) => {
                  const booking = getBooking(bay, hour);
                  const isYours = booking?.userId === currentUser.id;
                  const theme = BAY_THEME[bay];
                  const slotKey = `${dateStr}-${bay}-${hour}`;
                  const wasJustBooked = justBooked === slotKey;

                  return (
                    <motion.button
                      key={slotKey}
                      animate={wasJustBooked ? { scale: [0.92, 1.04, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleSlotClick(bay, hour)}
                      disabled={!!booking && !isYours}
                      className={cn(
                        "border-l border-border/20 h-8 px-1.5 flex items-center transition-all text-[11px] relative group",
                        booking
                          ? isYours
                            ? "bg-gradient-to-r from-accent/15 to-orange-100/50 cursor-pointer hover:from-accent/20"
                            : cn(theme.bgLight, "cursor-default")
                          : isFacility
                            ? "hover:bg-emerald-50/60 cursor-pointer"
                            : "hover:bg-slate-100/40 cursor-pointer",
                      )}
                    >
                      {booking ? (
                        <div className="flex items-center gap-1.5 w-full min-w-0">
                          {isYours ? (
                            <>
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center shrink-0">
                                <span className="text-[8px] font-bold text-white">Y</span>
                              </div>
                              <span className="truncate font-semibold text-accent">You</span>
                              <X className="w-3 h-3 text-accent/40 shrink-0 ml-auto" />
                            </>
                          ) : (
                            <>
                              <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0", theme.bg)}>
                                <User className="w-2.5 h-2.5 text-white" />
                              </div>
                              <span className={cn("truncate font-medium", theme.text)}>
                                {booking.userName.split(" ")[0]}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-transparent group-hover:text-emerald-500 transition-colors font-medium">
                          + Book
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Your Upcoming Bookings — compact inline */}
      {myUpcoming.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your Bookings</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {myUpcoming.map((b) => {
              const theme = BAY_THEME[b.bayNumber];
              return (
                <div
                  key={b.id}
                  className={cn(
                    "shrink-0 flex items-center gap-3 rounded-xl px-3.5 py-2.5 border",
                    theme.bgLight, theme.border,
                  )}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", theme.dot)} />
                      <span className="text-xs font-bold">Bay {b.bayNumber}</span>
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">
                      {format(new Date(b.date + "T00:00:00"), "EEE M/d")} · {formatHour(b.hour)}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal({ type: "cancel", booking: b })}
                    className="w-6 h-6 rounded-lg bg-white border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <X className="w-3 h-3 text-muted hover:text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Legend — minimal inline */}
      <div className="mt-4 flex items-center gap-4 text-[10px] text-muted pb-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-emerald-100 border border-emerald-200" />
          Open
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-accent/15 border border-accent/20" />
          Yours
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-blue-50 border border-blue-200" />
          Booked
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-slate-50 border border-border/40" />
          Off-hours
        </div>
        {isToday(selectedDate) && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-[2px] bg-red-500 rounded-full" />
            Now
          </div>
        )}
      </div>

      {/* Booking/Cancel Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl shadow-black/15 w-full max-w-xs overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.type === "book" ? (
                <>
                  {/* Gradient header */}
                  <div className={cn("p-4", BAY_THEME[modal.bay].bgLight)}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", BAY_THEME[modal.bay].bg)}>
                        <span className="text-sm font-black text-white">{modal.bay}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Bay {modal.bay}</p>
                        <p className="text-[11px] text-muted">{format(new Date(modal.date + "T00:00:00"), "EEEE, MMM d")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-xs text-muted flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</span>
                      <span className="text-sm font-bold">{formatHour(modal.hour)} — {formatHour(modal.hour + 1)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs text-muted">Rate</span>
                      <span className="text-sm font-bold">$45</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setModal(null)}
                        className="flex-1 text-xs font-semibold text-muted bg-slate-100 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        className="flex-1 text-xs font-semibold text-white bg-gradient-to-r from-accent to-orange-500 py-2.5 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-red-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Cancel Booking</p>
                        <p className="text-[11px] text-muted">Bay {modal.booking.bayNumber} · {format(new Date(modal.booking.date + "T00:00:00"), "EEE, MMM d")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted mb-3">
                      Cancel your {formatHour(modal.booking.hour)} slot?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal(null)}
                        className="flex-1 text-xs font-semibold text-muted bg-slate-100 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        Keep
                      </button>
                      <button
                        onClick={confirmAction}
                        className="flex-1 text-xs font-semibold text-white bg-red-500 py-2.5 rounded-xl hover:bg-red-600 transition-all"
                      >
                        Cancel Slot
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
