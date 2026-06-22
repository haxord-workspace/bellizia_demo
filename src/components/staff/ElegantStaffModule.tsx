// =============================================================================
// ElegantStaffModule.tsx
//
// Self-contained staff management module.
// Stack: React 18+, TypeScript, Tailwind CSS v3
// UI primitives: ../ui/ui-components (no Shadcn dependency)
//
// Exports: default ElegantStaffModule
// =============================================================================

import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronRight,
  Search,
  Phone,
  MapPin,
  ArrowLeft,
  Check,
  X,
  Star,
  Ban,
  CheckCircle2,
  Flower2,
  IndianRupee,
} from "lucide-react";

import type { StaffMember, ShiftApplication, ViewState, FilterRole, FilterStatus } from "./types";
import {
  navItems,
  tierStyles,
  statusStyles,
  tierFor,
  getInitials,
  initialStaff,
  initialApplications,
} from "./constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Separator,
  Input,
  Textarea,
} from "../ui/ui-components";

// =============================================================================
// StaffList
// =============================================================================

interface StaffListProps {
  staff: StaffMember[];
  onOpen: (id: string) => void;
}

function StaffList({ staff, onOpen }: StaffListProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("All");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

  const filtered = useMemo(
    () =>
      staff.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "All" || s.role === roleFilter;
        const matchesStatus = statusFilter === "All" || s.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [staff, search, roleFilter, statusFilter]
  );

  const activeCount = staff.filter((s) => s.status === "Active").length;

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Staff</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {staff.length} on roster &middot; {activeCount} active
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add staff
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          id="staff-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
          className="w-40 h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
        >
          {(["All", "Server", "Housekeeper", "Driver"] as FilterRole[]).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          id="staff-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="w-40 h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
        >
          {(["All", "Active", "Deactivated"] as FilterStatus[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <Card className="shadow-none">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No staff match these filters.
            </div>
          ) : (
            filtered.map((s, i) => (
              <div key={s.id}>
                <button
                  onClick={() => onOpen(s.id)}
                  className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0 select-none">
                      {getInitials(s.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.role} &middot; {s.location} &middot; {s.events} events completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {s.rating}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${tierStyles[tierFor(s.events)]}`}
                    >
                      {tierFor(s.events)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${statusStyles[s.status]}`}
                    >
                      {s.status}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
                {i < filtered.length - 1 && <Separator />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

// =============================================================================
// StaffDetail
// =============================================================================

interface StaffDetailProps {
  person: StaffMember;
  onBack: () => void;
  onDeactivate: (id: string, reason: string) => void;
  onReactivate: (id: string) => void;
}

function StaffDetail({ person, onBack, onDeactivate, onReactivate }: StaffDetailProps) {
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [reason, setReason] = useState("");

  const tier = tierFor(person.events);

  const nextThreshold: number | null =
    tier === "Extreme premium" ? null : tier === "Premium" ? 40 : 25;

  const handleConfirmDeactivate = () => {
    onDeactivate(person.id, reason);
    setShowDeactivate(false);
    setReason("");
  };

  return (
    <>
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to staff
      </button>

      {/* Name / header row */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 select-none">
            {getInitials(person.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                {person.name}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-normal ${statusStyles[person.status]}`}
              >
                {person.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {person.id} &middot; {person.role} &middot; {person.location}
            </p>
          </div>
        </div>

        {person.status === "Active" ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowDeactivate(true)}
          >
            <Ban className="h-4 w-4" />
            Deactivate
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => onReactivate(person.id)}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Reactivate
          </Button>
        )}
      </div>

      {/* Deactivation form */}
      {showDeactivate && (
        <Card className="shadow-none mb-4 border-red-200 bg-red-50/30">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium text-slate-900">
              Deactivate {person.name}&apos;s account
            </p>
            <p className="text-xs text-slate-500">
              A reason is required and will be logged against this staff member&apos;s record.
            </p>
            <Textarea
              placeholder="e.g. Repeated late arrivals, last incident 12 June 2026"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                disabled={!reason.trim()}
                onClick={handleConfirmDeactivate}
              >
                Confirm deactivation
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDeactivate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deactivation reason banner */}
      {person.status === "Deactivated" && person.deactivationReason && (
        <Card className="shadow-none mb-4 border-slate-200 bg-slate-50/60">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Deactivation reason</p>
            <p className="text-sm text-slate-900">{person.deactivationReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Two-column detail grid */}
      <div className="grid grid-cols-[1.3fr_1fr] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Contact card */}
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">
                Contact &amp; details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                    <Phone className="h-3 w-3" /> Phone
                  </p>
                  <p className="text-slate-900">{person.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="text-slate-900">{person.location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Joined</p>
                  <p className="text-slate-900">{person.joined}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                    <IndianRupee className="h-3 w-3" /> Base rate
                  </p>
                  <p className="text-slate-900">₹{person.baseRate} / event</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event history card */}
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">
                Recent event history
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {person.history.map((h, i) => (
                <div key={`${h.event}-${h.date}`}>
                  <div className="flex items-center justify-between px-6 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{h.event}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.date}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {h.rating}
                    </span>
                  </div>
                  {i < person.history.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Tier card */}
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">
                Tier &amp; promotion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className={`text-xs font-normal ${tierStyles[tier]}`}>
                {tier}
              </Badge>

              {nextThreshold !== null ? (
                <>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (person.events / nextThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {person.events} / {nextThreshold} events to next tier
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-500">Highest tier reached.</p>
              )}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Average rating</span>
                <span className="flex items-center gap-1 text-slate-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {person.rating}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total events</span>
                <span className="text-slate-900">{person.events}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// ApplicationsPanel
// =============================================================================

interface ApplicationsPanelProps {
  applications: ShiftApplication[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ApplicationsPanel({ applications, onApprove, onReject }: ApplicationsPanelProps) {
  if (applications.length === 0) return null;

  return (
    <Card className="shadow-none mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-900">
          Pending shift applications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {applications.map((a, i) => (
          <div key={a.id}>
            <div className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{a.staffName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {a.role} &middot; {a.event} &middot; {a.date} &middot; {a.distance} away
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onApprove(a.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onReject(a.id)}
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </div>
            {i < applications.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// ElegantStaffModule  ← default export
// =============================================================================

export default function ElegantStaffModule() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [applications, setApplications] = useState<ShiftApplication[]>(initialApplications);
  const [view, setView] = useState<ViewState>({ screen: "list" });

  const openStaff = (id: string) => setView({ screen: "detail", id });
  const goToList = () => setView({ screen: "list" });

  const handleDeactivate = (id: string, reason: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Deactivated" as const, deactivationReason: reason } : s
      )
    );
    // Stay on detail view so the reason banner shows immediately
  };

  const handleReactivate = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "Active" as const, deactivationReason: undefined }
          : s
      )
    );
  };

  const handleApprove = (id: string) =>
    setApplications((prev) => prev.filter((a) => a.id !== id));

  const handleReject = (id: string) =>
    setApplications((prev) => prev.filter((a) => a.id !== id));

  const activeStaff =
    view.screen === "detail" ? (staff.find((s) => s.id === view.id) ?? null) : null;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex font-sans">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                             */}
      {/* ------------------------------------------------------------------ */}
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-200">
          <div className="h-7 w-7 rounded-md bg-slate-900 flex items-center justify-center">
            <Flower2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-slate-900 tracking-tight">Elegant</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-2 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "Staff";
            return (
              <button
                key={item.label}
                onClick={() => item.label === "Staff" && goToList()}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-left transition-colors ${
                  isActive
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {view.screen === "list" && (
            <>
              <ApplicationsPanel
                applications={applications}
                onApprove={handleApprove}
                onReject={handleReject}
              />
              <StaffList staff={staff} onOpen={openStaff} />
            </>
          )}

          {view.screen === "detail" && activeStaff && (
            <StaffDetail
              person={activeStaff}
              onBack={goToList}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
            />
          )}
        </div>
      </main>
    </div>
  );
}
