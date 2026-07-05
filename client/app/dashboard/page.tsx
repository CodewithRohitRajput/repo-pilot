"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [repos, setRepos] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [connectedRepos, setConnectedRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [label, setLabel] = useState("");
    const [slackEnabled, setSlackEnabled] = useState(true);
    const [saving, setSaving] = useState(false);
    const [connectingId, setConnectingId] = useState<any>(null);

    const handleLogout = async () => {
        try {
            await fetch("https://repo-pilot-sps0.onrender.com/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.log(err);
        } finally {
            window.location.href = "/";
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const userRes = await fetch("https://repo-pilot-sps0.onrender.com/auth/me", {
                    credentials: "include",
                });

                if (!userRes.ok) {
                    window.location.href = "/";
                    return;
                }

                const userData = await userRes.json();
                setUser(userData.user);

                const repoRes = await fetch("https://repo-pilot-sps0.onrender.com/repo", {
                    credentials: "include",
                });
                const repoData = await repoRes.json();
                setRepos(repoData);

                const connectedRes = await fetch(
                    "https://repo-pilot-sps0.onrender.com/repo/connected",
                    { credentials: "include" }
                );
                const connectedData = await connectedRes.json();
                setConnectedRepos(connectedData);

                const eventRes = await fetch("https://repo-pilot-sps0.onrender.com/events", {
                    credentials: "include",
                });
                const eventData = await eventRes.json();
                setEvents(eventData);

                const ruleRes = await fetch("https://repo-pilot-sps0.onrender.com/rules", {
                    credentials: "include",
                });
                const ruleData = await ruleRes.json();

                if (ruleData) {
                    setKeyword(ruleData.keyword || "");
                    setLabel(ruleData.label || "");
                    setSlackEnabled(ruleData.slackEnabled ?? true);
                }
            } catch (err) {
                console.log(err);
                window.location.href = "/";
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleConnect = async (repo: any) => {
        setConnectingId(repo.id);
        try {
            const res = await fetch("https://repo-pilot-sps0.onrender.com/repo/connect", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    githubRepoId: repo.id,
                    name: repo.name,
                    owner: repo.owner.login,
                    fullName: repo.full_name,
                }),
            });

            if (res.ok) {
                const connectedRes = await fetch(
                    "https://repo-pilot-sps0.onrender.com/repo/connected",
                    { credentials: "include" }
                );
                const connectedData = await connectedRes.json();
                setConnectedRepos(connectedData);
            }
        } finally {
            setConnectingId(null);
        }
    };

    const saveRule = async () => {
        setSaving(true);
        try {
            const response = await fetch("https://repo-pilot-sps0.onrender.com/rules", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyword, label, slackEnabled }),
            });
            await response.json();
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDEAE1] flex items-center justify-center">
                <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-[#1A1A1A]">
                    <span className="w-2.5 h-2.5 bg-[#F5A623] border border-[#1A1A1A] animate-pulse" />
                    Powering up
                </div>
            </div>
        );
    }

    const connectedIds = connectedRepos.map((repo: any) => repo.githubRepoId);

    return (
        <main className="min-h-screen bg-[#EDEAE1] text-[#1A1A1A]">
            {/* ---------- Top bar ---------- */}
            <header className="border-b-2 border-[#1A1A1A]">
                <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#1A1A1A] bg-[#F5A623] flex items-center justify-center font-black text-sm">
                            R
                        </div>
                        <span className="font-black tracking-tight text-lg uppercase">
                            RepoPilot
                        </span>
                        <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-[#6B6B63] border border-[#6B6B63] px-1.5 py-0.5">
                            Control Panel
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={user?.avatar}
                                alt="avatar"
                                className="w-9 h-9 border-2 border-[#1A1A1A]"
                            />
                            <div className="hidden sm:block leading-tight">
                                <p className="text-sm font-bold">{user?.name}</p>
                                <p className="text-xs font-mono text-[#6B6B63]">
                                    @{user?.username}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-xs font-mono uppercase tracking-widest border-2 border-[#1A1A1A] px-3 py-2 hover:bg-[#1A1A1A] hover:text-[#EDEAE1] transition-colors"
                        >
                            Power off
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
                {/* ---------- Repositories as ports ---------- */}
                <section>
                    <div className="flex items-baseline justify-between mb-4">
                        <h2 className="font-black uppercase tracking-wide text-sm">
                            Repository ports
                        </h2>
                        <span className="text-xs font-mono text-[#6B6B63]">
                            {connectedIds.length} / {repos.length} wired
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {repos.map((repo: any) => {
                            const isConnected = connectedIds.includes(repo.id);
                            return (
                                <div
                                    key={repo.id}
                                    className="border-2 border-[#1A1A1A] bg-[#FBFAF6] p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className={`shrink-0 w-2.5 h-2.5 rounded-full border border-[#1A1A1A] ${
                                                isConnected
                                                    ? "bg-[#2E8B57]"
                                                    : "bg-[#D9D5C7]"
                                            }`}
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm truncate">
                                                {repo.name}
                                            </h3>
                                            <p className="text-xs font-mono text-[#6B6B63] truncate">
                                                {repo.full_name}
                                            </p>
                                        </div>
                                    </div>

                                    {isConnected ? (
                                        <span className="text-xs font-mono uppercase tracking-wider text-[#2E8B57] shrink-0 ml-3">
                                            Connected
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(repo)}
                                            disabled={connectingId === repo.id}
                                            className="shrink-0 ml-3 text-xs font-mono uppercase tracking-wider border-2 border-[#1A1A1A] bg-[#F5A623] px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-[#F5A623] disabled:opacity-50 transition-colors"
                                        >
                                            {connectingId === repo.id ? "Connecting" : "Connect"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {repos.length === 0 && (
                            <div className="sm:col-span-2 border-2 border-dashed border-[#1A1A1A] p-8 text-center text-sm font-mono text-[#6B6B63]">
                                No repositories detected on this account.
                            </div>
                        )}
                    </div>
                </section>

                {/* ---------- Automation rule as breaker panel ---------- */}
                <section>
                    <h2 className="font-black uppercase tracking-wide text-sm mb-4">
                        Automation breaker
                    </h2>

                    <div className="border-2 border-[#1A1A1A] bg-[#FBFAF6] p-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#6B6B63] mb-2">
                                    Trigger — issue title contains
                                </label>
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="bug"
                                    className="w-full bg-[#EDEAE1] border-2 border-[#1A1A1A] px-3 py-2.5 font-mono text-sm focus:outline-none focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#6B6B63] mb-2">
                                    Action — apply label
                                </label>
                                <input
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="bug"
                                    className="w-full bg-[#EDEAE1] border-2 border-[#1A1A1A] px-3 py-2.5 font-mono text-sm focus:outline-none focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Rocker switch */}
                        <div className="mt-6 flex items-center justify-between border-2 border-[#1A1A1A] px-4 py-3">
                            <div>
                                <p className="text-sm font-bold">Slack notification</p>
                                <p className="text-xs font-mono text-[#6B6B63]">
                                    Ping #issues when the rule fires
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSlackEnabled(!slackEnabled)}
                                aria-pressed={slackEnabled}
                                className={`relative w-14 h-8 border-2 border-[#1A1A1A] shrink-0 transition-colors ${
                                    slackEnabled ? "bg-[#2E8B57]" : "bg-[#D9D5C7]"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-6 h-6 bg-[#FBFAF6] border-2 border-[#1A1A1A] transition-all ${
                                        slackEnabled ? "left-6" : "left-0.5"
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="mt-6 pt-5 border-t-2 border-dashed border-[#1A1A1A] flex justify-end">
                            <button
                                onClick={saveRule}
                                disabled={saving}
                                className="text-sm font-mono uppercase tracking-widest border-2 border-[#1A1A1A] bg-[#F5A623] px-5 py-2.5 hover:bg-[#1A1A1A] hover:text-[#F5A623] disabled:opacity-50 transition-colors"
                            >
                                {saving ? "Saving…" : "Engage rule"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ---------- Activity log ---------- */}
                <section>
                    <h2 className="font-black uppercase tracking-wide text-sm mb-4">
                        Activity log
                    </h2>

                    <div className="border-2 border-[#1A1A1A] bg-[#FBFAF6] divide-y-2 divide-[#1A1A1A]">
                        {events.map((event: any) => {
                            const meta =
                                event.action === "opened"
                                    ? { dot: "#2E8B57", label: "Issue opened" }
                                    : event.action === "labeled"
                                    ? { dot: "#F5A623", label: "Label added" }
                                    : event.action === "unlabeled"
                                    ? { dot: "#D64545", label: "Label removed" }
                                    : { dot: "#6B6B63", label: event.action };

                            return (
                                <div key={event._id} className="px-5 py-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm font-bold">
                                            <span
                                                className="w-2 h-2 border border-[#1A1A1A]"
                                                style={{ backgroundColor: meta.dot }}
                                            />
                                            {meta.label}
                                        </span>
                                        <span className="text-xs font-mono text-[#6B6B63]">
                                            {new Date(event.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <p className="text-sm mt-2.5">{event.issueTitle}</p>

                                    <div className="flex gap-4 mt-2 text-xs font-mono text-[#6B6B63]">
                                        <span>{event.repository}</span>
                                        <span>@{event.sender}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {events.length === 0 && (
                            <div className="px-5 py-8 text-center text-sm font-mono text-[#6B6B63]">
                                No activity logged yet.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}