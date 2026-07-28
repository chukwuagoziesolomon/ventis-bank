"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, User, Bell, Upload } from "lucide-react";
import { useVantis } from "@/lib/store";

type Tab = "profile" | "security" | "notifications";

export default function SettingsPage() {
  const { user, updateProfile, uploadAvatar } = useVantis();
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    image: user?.image ?? "",
  });
  const [notifications, setNotifications] = useState({
    transfers: true,
    lowBalance: true,
    marketing: false,
    weeklySummary: true,
  });

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile(profile);
    flashSaved();
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-bone mb-1">Settings</h1>
      <p className="text-sm text-bone/40 mb-8">Manage your profile, security, and preferences.</p>

      <div className="flex gap-2 mb-6 border-b border-white/5 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id ? "bg-ink-700 text-bone" : "text-bone/40 hover:text-bone/70"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-white/5 bg-ink-800 p-6 space-y-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-ink-950 border border-white/10 grid place-items-center overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-bone/60">{user?.initials ?? "VB"}</span>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-bone hover:bg-white/10 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" /> Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await uploadAvatar(file);
                        setProfile({ ...profile, image: url });
                      } catch (err) {
                        alert(err instanceof Error ? err.message : "Upload failed.");
                      }
                    }
                  }}
                />
              </label>
              <p className="text-xs text-bone/30 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <Field label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
            <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
            <Field label="Address" value={profile.address} onChange={(v) => setProfile({ ...profile, address: v })} />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "Saved" : "Save changes"}
          </button>
        </motion.form>
      )}

      {tab === "security" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-ink-800 p-6 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Current password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
            <div />
            <Field label="New password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
            <Field label="Confirm new password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
          </div>
          <button
            type="button"
            onClick={flashSaved}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-950 font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "Updated" : "Update password"}
          </button>

          <div className="pt-5 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-bone">Two-factor authentication</p>
                <p className="text-xs text-bone/40 mt-0.5">Add an extra layer of security to your account.</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
          </div>
        </motion.div>
      )}

      {tab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-ink-800 p-6 divide-y divide-white/5"
        >
          <NotificationRow
            title="Transfer alerts"
            description="Get notified when money moves in or out of your accounts."
            checked={notifications.transfers}
            onChange={(v) => setNotifications({ ...notifications, transfers: v })}
          />
          <NotificationRow
            title="Low balance warnings"
            description="A heads up when an account drops below $100."
            checked={notifications.lowBalance}
            onChange={(v) => setNotifications({ ...notifications, lowBalance: v })}
          />
          <NotificationRow
            title="Weekly summary"
            description="A Sunday digest of your spending and income."
            checked={notifications.weeklySummary}
            onChange={(v) => setNotifications({ ...notifications, weeklySummary: v })}
          />
          <NotificationRow
            title="Product news"
            description="Occasional updates about new Vantis features."
            checked={notifications.marketing}
            onChange={(v) => setNotifications({ ...notifications, marketing: v })}
          />
        </motion.div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-bone/40 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full bg-ink-700/60 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm placeholder:text-bone/25 focus:border-gold-400/50 outline-none"
      />
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setChecked((c) => !c)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-gold-400" : "bg-white/10"}`}
      aria-pressed={checked}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-ink-950"
      />
    </button>
  );
}

function NotificationRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="pr-4">
        <p className="text-sm text-bone">{title}</p>
        <p className="text-xs text-bone/40 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${checked ? "bg-gold-400" : "bg-white/10"}`}
        aria-pressed={checked}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-ink-950"
        />
      </button>
    </div>
  );
}
