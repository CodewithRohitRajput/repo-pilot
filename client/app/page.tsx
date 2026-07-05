"use client";

export default function Home() {

    const handleLogin = () => {
        window.location.href = "http://localhost:8000/auth/github";
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-xl shadow-md text-center">

                <h1 className="text-4xl font-bold">
                    RepoPilot 🚀
                </h1>

                <p className="mt-3 text-gray-600">
                    Event Driven GitHub Automation
                </p>

                <button
                    onClick={handleLogin}
                    className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                    Continue with GitHub
                </button>

            </div>

        </main>
    );
}