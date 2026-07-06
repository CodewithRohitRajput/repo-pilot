"use client";

export default function Home() {
    const handleLogin = () => {
        window.location.href =
            "https://repo-pilot-sps0.onrender.com/auth/github";
    };

    return (
        <main className="min-h-screen bg-[#EDEAE1] text-[#1A1A1A]">
            <div className="max-w-6xl mx-auto px-6">
                {/* ---------- Nav ---------- */}
                <nav className="flex justify-between items-center py-6 border-b-2 border-[#1A1A1A]">
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

                    <button
                        onClick={handleLogin}
                        className="text-xs font-mono uppercase tracking-widest border-2 border-[#1A1A1A] bg-[#F5A623] px-4 py-2.5 hover:bg-[#1A1A1A] hover:text-[#F5A623] transition-colors"
                    >
                        Login with GitHub
                    </button>
                </nav>

                {/* ---------- Hero ---------- */}
                <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
                    <div>
                        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest border border-[#1A1A1A] px-2.5 py-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] border border-[#1A1A1A]" />
                            Event driven · Always on
                        </span>

                        <h2 className="text-5xl sm:text-6xl font-black mt-8 leading-[1.05]">
                            Wire up your
                            <br />
                            GitHub workflow
                        </h2>

                        <p className="mt-7 text-base leading-7 text-[#4A4A44] max-w-md">
                            Connect your repositories, receive webhook events
                            in real time, auto-label issues, and notify Slack
                            — all switched on from one panel.
                        </p>

                        <div className="mt-9">
                            <button
                                onClick={handleLogin}
                                className="text-sm font-mono uppercase tracking-widest border-2 border-[#1A1A1A] bg-[#F5A623] px-6 py-3.5 hover:bg-[#1A1A1A] hover:text-[#F5A623] transition-colors"
                            >
                                Continue with GitHub →
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-14 max-w-md">
                            {[
                                { k: "GitHub", v: "OAuth" },
                                { k: "Slack", v: "Notifications" },
                                { k: "Live", v: "Webhooks" },
                            ].map((stat) => (
                                <div
                                    key={stat.k}
                                    className="border-2 border-[#1A1A1A] bg-[#FBFAF6] px-3 py-3.5"
                                >
                                    <h3 className="font-black text-sm">{stat.k}</h3>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B63] mt-0.5">
                                        {stat.v}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---------- Automation flow panel ---------- */}
                    <div className="border-2 border-[#1A1A1A] bg-[#FBFAF6] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black uppercase tracking-wide text-sm">
                                Automation breaker
                            </h3>
                            <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#2E8B57]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
                                Live
                            </span>
                        </div>

                        <div className="space-y-0">
                            {[
                                { icon: "🐙", label: "GitHub issue created" },
                                { icon: "⚙️", label: "Webhook received" },
                                { icon: "🏷️", label: "Auto label applied" },
                                { icon: "💬", label: "Slack notified" },
                                { icon: "📊", label: "Dashboard updated" },
                            ].map((step, i, arr) => (
                                <div key={step.label}>
                                    <div className="flex items-center gap-3 border-2 border-[#1A1A1A] px-4 py-3.5">
                                        <span
                                            className="w-2 h-2 rounded-full border border-[#1A1A1A] shrink-0"
                                            style={{
                                                backgroundColor:
                                                    i === arr.length - 1
                                                        ? "#F5A623"
                                                        : "#2E8B57",
                                            }}
                                        />
                                        <span className="text-lg leading-none">
                                            {step.icon}
                                        </span>
                                        <span className="text-sm font-mono">
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className="flex justify-center py-1.5">
                                            <span className="text-[#6B6B63] font-mono text-xs">
                                                │
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------- Footer strip ---------- */}
                <div className="border-t-2 border-[#1A1A1A] py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#6B6B63]">
                    <span>RepoPilot · Built for shipping teams</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] border border-[#1A1A1A]" />
                        All systems operational
                    </span>
                </div>
            </div>
        </main>
    );
}