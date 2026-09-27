"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
    const [url, setUrl] = useState("");
    const router = useRouter();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            alert("回答用URLを入力してください");
            return;
        }

        try {
            const parsedUrl = new URL(trimmedUrl);

            if (!parsedUrl.pathname.startsWith("/respond/")) {
                alert("正しい回答用URLを入力してください");
                return;
            }

            router.push(parsedUrl.pathname);
        } catch {
            alert("正しいURLを入力してください");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-5xl px-6 py-5">
                    <h1 className="text-2xl font-bold">
                        NoMeet
                    </h1>
                </div>
            </header>

            <section className="mx-auto max-w-xl px-6 py-16">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold">
                        会議に参加する
                    </h2>

                    <p className="mt-3 text-gray-500">
                        受け取った回答用URLを入力してください。
                    </p>

                    <form
                        onSubmit={handleJoin}
                        className="mt-8"
                    >
                        <label className="block text-sm font-semibold">
                            回答用URL
                        </label>

                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/respond/..."
                            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />

                        <button
                            type="submit"
                            className="mt-5 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                        >
                            会議に参加する
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}