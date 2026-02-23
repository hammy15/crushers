"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, isToday, getDay } from "date-fns";
import { useDemo } from "@/lib/demo-context";
import { cn } from "@/lib/utils";
import { formatHour, isWithinFacilityHours } from "@/lib/utils";
import type { BayBooking } from "@/types/trackman";

const BAY_LABELS = ["Bay 1", "Bay 2", "Bay 3"] as const;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

type ViewMode = "day" | "week";
type ModalAction =
  | { type: "book"; bay: 1 | 2 | 3; date: string; hour: number }
  | { type: "cancel"; booking: BayBooking };

export default function SchedulePage() {
  const { bookings, bookSlot, cancelBooking, currentUser } = useDemo();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedBay, setSelectedBay] = useState<1 | 2 | 3>(1);
  const [modal, setModal] = useState<ModalAction | null>(null);
  const [justBooked, setJustBooked] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayOfWeek = getDay(selectedDate);

  // Week view: 7 days starting from Monday of selected week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart.getTime()],
  );

  // Auto-scroll to current hour on mount
  useEffect(() => {
    const hour = new Date().getHours();
    const el = document.getElementById(`hour-row-${hour}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, []);

  // Clear justBooked after animation
  useEffect(() => {
    if (justBooked) {
      const t = setTimeout(() => setJustBooked(null), 600);
      return () => clearTimeout(t);
    }
  }, [justBooked]);

  function getBookingForSlot(date: string, bay: number, hour: number): BayBooking | undefined {
    return bookings.find(
      (b) => b.date === date && b.bayNumber === bay && b.hour === hour,
    );
  }

  function handleSlotClick(bay: 1 | 2 | 3, date: string, hour: number) {
    const existing = getBookingForSlot(date, bay, hour);
    if (existing) {
      if (existing.userId === currentUser.id) {
        setModal({ type: "cancel", booking: existing });
      }
      return; // not yours — no action
    }
    setModal({ type: "book", bay, date, hour });
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

  function renderSlotCell(bay: 1 | 2 | 3, date: string, hour: number, dayIdx: number) {
    const booking = getBookingForSlot(date, bay, hour);
    const isYours = booking?.userId === currentUser.id;
    const isFacilityHour = isWithinFacilityHours(dayIdx, hour);
    const slotKey = `${date}-${bay}-${hour}`;
    const wasJustBooked = justBooked === slotKey;
    const now = new Date();
    const isCurrentHour =
      isToday(new Date(date + "T00:00:00")) && now.getHours() === hour;

    const cellContent = booking ? (
      <div className="flex items-center justify-between gap-1 w-full">
        <span className="truncate text-[11px]">{isYours ? "You" : booking.userName.split(" ")[0]}</span>
        {isYours && <X className="w-3 h-3 shrink-0 opacity-50" />}
      </div>
    ) : (
      <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
    );

    return (
      <motion.button
        key={slotKey}
        animate={wasJustBooked ? { scale: [0.95, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        onClick={() => handleSlotClick(bay, date, hour)}
        disabled={!!booking && !isYours}
        className={cn(
          "group relative h-11 rounded-lg px-2 flex items-center transition-all text-xs border",
          isCurrentHour && "ring-2 ring-accent/30",
          booking
            ? isYours
              ? "bg-accent/10 border-accent/20 text-accent font-semibold cursor-pointer hover:bg-accent/15"
              : "bg-slate-100 border-slate-200 text-muted cursor-default"
            : isFacilityHour
              ? "bg-white border-border hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer"
              : "bg-slate-50/50 border-border/40 hover:bg-slate-100 cursor-pointer text-muted/50",
        )}
      >
        {cellContent}
      </motion.button>
    );
  }

  // -- Render --

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-black tracking-tight">Schedule</h1>
        <p className="text-muted mt-1">
          Book a bay for your next session — 3 bays available 24/7
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((d) => subDays(d, viewMode === "week" ? 7 : 1))}
            className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center min-w-[200px]">
            <p className="text-sm font-bold">
              {viewMode === "day"
                ? format(selectedDate, "EEEE, MMMM d, yyyy")
                : `${format(weekDays[0], "MMM d")} — ${format(weekDays[6], "MMM d, yyyy")}`}
            </p>
          </div>

          <button
            onClick={() => setSelectedDate((d) => addDays(d, viewMode === "week" ? 7 : 1))}
            className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday(selectedDate) && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/15 transition-colors"
            >
              Today
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(["day", "week"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "text-xs font-semibold px-4 py-1.5 rounded-lg transition-all capitalize",
                viewMode === mode
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bay Tabs (week view or mobile) */}
      {viewMode === "week" && (
        <div className="mt-4 flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {([1, 2, 3] as const).map((bay) => (
            <button
              key={bay}
              onClick={() => setSelectedBay(bay)}
              className={cn(
                "text-xs font-semibold px-4 py-1.5 rounded-lg transition-all",
                selectedBay === bay
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              Bay {bay}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-border" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent/15 border border-accent/20" />
          <span>Your Booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-50/50 border border-border/40" />
          <span>Off-hours</span>
        </div>
      </div>

      {/* Schedule Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-5 bg-white rounded-2xl border border-border overflow-hidden"
        ref={gridRef}
      >
        {viewMode === "day" ? (
          /* ========== DAY VIEW ========== */
          <div>
            {/* Header */}
            <div className="grid grid-cols-[60px_1fr_1fr_1fr] border-b border-border bg-slate-50/50">
              <div className="p-3 text-[10px] font-bold text-muted uppercase tracking-wider flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Time
              </div>
              {BAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "p-3 text-[10px] font-bold text-muted uppercase tracking-wider text-center",
                    i < 2 && "border-l border-border",
                  )}
                >
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map((hour) => {
                const isFacility = isWithinFacilityHours(dayOfWeek, hour);
                const now = new Date();
                const isCurrentHour = isToday(selectedDate) && now.getHours() === hour;

                return (
                  <div
                    key={hour}
                    id={`hour-row-${hour}`}
                    className={cn(
                      "grid grid-cols-[60px_1fr_1fr_1fr] gap-x-1.5 border-b border-border/30 px-1.5 py-1",
                      isCurrentHour && "bg-accent/[0.03]",
                      !isFacility && "bg-slate-50/30",
                    )}
                  >
                    <div className="flex items-center justify-end pr-2">
                      <span
                        className={cn(
                          "text-[11px] font-medium tabular-nums",
                          isCurrentHour ? "text-accent font-bold" : "text-muted",
                        )}
                      >
                        {formatHour(hour)}
                      </span>
                    </div>
                    {([1, 2, 3] as const).map((bay) =>
                      renderSlotCell(bay, dateStr, hour, dayOfWeek),
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========== WEEK VIEW ========== */
          <div>
            {/* Header */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-slate-50/50">
              <div className="p-3 text-[10px] font-bold text-muted uppercase tracking-wider flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Time
              </div>
              {weekDays.map((day, i) => {
                const isCurrentDay = isToday(day);
                return (
                  <div
                    key={i}
                    className={cn(
                      "p-2 text-center border-l border-border",
                      isCurrentDay && "bg-accent/5",
                    )}
                  >
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isCurrentDay ? "text-accent" : "text-muted",
                    )}>
                      {format(day, "EEE")}
                    </p>
                    <p className={cn(
                      "text-xs font-bold mt-0.5",
                      isCurrentDay ? "text-accent" : "text-foreground",
                    )}>
                      {format(day, "M/d")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map((hour) => {
                const now = new Date();
                const isCurrentHour = now.getHours() === hour;

                return (
                  <div
                    key={hour}
                    id={`hour-row-${hour}`}
                    className={cn(
                      "grid grid-cols-[60px_repeat(7,1fr)] gap-x-1 border-b border-border/30 px-1 py-1",
                      isCurrentHour && "bg-accent/[0.03]",
                    )}
                  >
                    <div className="flex items-center justify-end pr-2">
                      <span
                        className={cn(
                          "text-[11px] font-medium tabular-nums",
                          isCurrentHour ? "text-accent font-bold" : "text-muted",
                        )}
                      >
                        {formatHour(hour)}
                      </span>
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const ds = format(day, "yyyy-MM-dd");
                      const dow = getDay(day);
                      return (
                        <div key={dayIdx}>
                          {renderSlotCell(selectedBay, ds, hour, dow)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Upcoming Bookings Summary */}
      {(() => {
        const myBookings = bookings
          .filter((b) => b.userId === currentUser.id && b.date >= format(new Date(), "yyyy-MM-dd"))
          .sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour);

        if (myBookings.length === 0) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 bg-white rounded-2xl border border-border p-5"
          >
            <h3 className="text-sm font-bold mb-3">Your Upcoming Bookings</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between bg-accent/5 rounded-xl px-4 py-3 border border-accent/10"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">Bay {b.bayNumber}</p>
                    <p className="text-[11px] text-muted">
                      {format(new Date(b.date + "T00:00:00"), "EEE, MMM d")} · {formatHour(b.hour)}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal({ type: "cancel", booking: b })}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Booking/Cancel Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.type === "book" ? (
                <>
                  <h3 className="text-lg font-bold">Book Bay {modal.bay}</h3>
                  <div className="mt-3 bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Date</span>
                      <span className="font-semibold">
                        {format(new Date(modal.date + "T00:00:00"), "EEEE, MMM d")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Time</span>
                      <span className="font-semibold">{formatHour(modal.hour)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Duration</span>
                      <span className="font-semibold">1 hour</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Rate</span>
                      <span className="font-semibold">$45/hr</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="flex-1 text-sm font-semibold text-foreground bg-slate-100 py-2.5 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAction}
                      className="flex-1 text-sm font-semibold text-white bg-gradient-to-r from-accent to-orange-500 py-2.5 rounded-full hover:shadow-lg hover:shadow-accent/25 transition-all"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-red-600">Cancel Booking</h3>
                  <p className="text-sm text-muted mt-2">
                    Are you sure you want to cancel your booking?
                  </p>
                  <div className="mt-3 bg-red-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Bay</span>
                      <span className="font-semibold">Bay {modal.booking.bayNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Date</span>
                      <span className="font-semibold">
                        {format(new Date(modal.booking.date + "T00:00:00"), "EEEE, MMM d")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Time</span>
                      <span className="font-semibold">{formatHour(modal.booking.hour)}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="flex-1 text-sm font-semibold text-foreground bg-slate-100 py-2.5 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      Keep It
                    </button>
                    <button
                      onClick={confirmAction}
                      className="flex-1 text-sm font-semibold text-white bg-red-500 py-2.5 rounded-full hover:bg-red-600 transition-all"
                    >
                      Cancel Booking
                    </button>
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
