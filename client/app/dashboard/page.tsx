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

    useEffect(() => {
        const loadData = async () => {
            try {
                // User
                const userRes = await fetch("http://localhost:8000/auth/me", {
                    credentials: "include",
                });

                if (!userRes.ok) {
                    window.location.href = "/";
                    return;
                }

                const userData = await userRes.json();
                setUser(userData.user);

                // GitHub Repositories
                const repoRes = await fetch("http://localhost:8000/repo", {
                    credentials: "include",
                });

                const repoData = await repoRes.json();
                setRepos(repoData);

                // Connected Repositories
                const connectedRes = await fetch(
                    "http://localhost:8000/repo/connected",
                    {
                        credentials: "include",
                    }
                );

                const connectedData = await connectedRes.json();
                setConnectedRepos(connectedData);

                // Events
                const eventRes = await fetch("http://localhost:8000/events", {
                    credentials: "include",
                });

                const eventData = await eventRes.json();
                setEvents(eventData);

                // ----- NEW: Fetch rule -----
                const ruleRes = await fetch("http://localhost:8000/rules", {
                    credentials: "include",
                });

                const ruleData = await ruleRes.json();

                if (ruleData) {
                    setKeyword(ruleData.keyword || "");
                    setLabel(ruleData.label || "");
                    setSlackEnabled(ruleData.slackEnabled ?? true);
                }
                // ----------------------------
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
        const res = await fetch("http://localhost:8000/repo/connect", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                githubRepoId: repo.id,
                name: repo.name,
                owner: repo.owner.login,
                fullName: repo.full_name,
            }),
        });

        if (res.ok) {
            const connectedRes = await fetch(
                "http://localhost:8000/repo/connected",
                {
                    credentials: "include",
                }
            );

            const connectedData = await connectedRes.json();
            setConnectedRepos(connectedData);
        }
    };

    // ----- NEW: saveRule function -----
    const saveRule = async () => {
        const response = await fetch("http://localhost:8000/rules", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keyword,
                label,
                slackEnabled,
            }),
        });

        const data = await response.json();
        console.log(data);
        alert("Rule Saved Successfully 🚀");
    };
    // -----------------------------------

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const connectedIds = connectedRepos.map((repo: any) => repo.githubRepoId);

    return (
        <main className="min-h-screen bg-gray-100 p-10 text-black">
            <h1 className="text-4xl font-bold">RepoPilot 🚀</h1>

            <div className="mt-8 flex items-center gap-5">
                <img
                    src={user?.avatar}
                    alt="avatar"
                    className="w-20 h-20 rounded-full"
                />
                <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-gray-600">@{user?.username}</p>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Your Repositories</h2>

                {repos.map((repo: any) => (
                    <div
                        key={repo.id}
                        className="bg-white rounded-lg shadow p-5 mb-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold text-lg">{repo.name}</h3>
                            <p className="text-gray-500">{repo.full_name}</p>
                        </div>
                        {connectedIds.includes(repo.id) ? (
                            <span className="text-green-600 font-semibold">
                                ✅ Connected
                            </span>
                        ) : (
                            <button
                                onClick={() => handleConnect(repo)}
                                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ----- NEW: Automation Rule UI ----- */}
            <div className="mt-14">
                <h2 className="text-3xl font-bold mb-6">Automation Rule</h2>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-5">
                        <label className="block font-semibold mb-2">Keyword</label>
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border w-full p-3 rounded"
                            placeholder="bug"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block font-semibold mb-2">Label</label>
                        <input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="border w-full p-3 rounded"
                            placeholder="bug"
                        />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            checked={slackEnabled}
                            onChange={(e) => setSlackEnabled(e.target.checked)}
                        />
                        <label>Send Slack Notification</label>
                    </div>
                    <button
                        onClick={saveRule}
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Save Rule
                    </button>
                </div>
            </div>
            {/* --------------------------------- */}

            <div className="mt-14">
                <h2 className="text-3xl font-bold mb-6">Recent Activity</h2>

                {events.map((event: any) => (
                    <div
                        key={event._id}
                        className="bg-white rounded-lg shadow p-5 mb-4"
                    >
                        <h3 className="font-bold text-lg">
                            {event.action === "opened"
                                ? "🟢 Issue Opened"
                                : event.action === "labeled"
                                ? "🏷️ Label Added"
                                : event.action === "unlabeled"
                                ? "❌ Label Removed"
                                : event.action}
                        </h3>
                        <p className="mt-3">
                            <strong>Issue :</strong> {event.issueTitle}
                        </p>
                        <p>
                            <strong>Repository :</strong> {event.repository}
                        </p>
                        <p>
                            <strong>User :</strong> {event.sender}
                        </p>
                        <p>
                            <strong>Event :</strong> {event.eventType}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(event.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}