"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateMeeting() {
    const router = useRouter();
    const supabase = createClient();

    const [title, setTitle] = useState("");
    const [purpose, setPurpose] = useState("");
    const [responseDeadline, setResponseDeadline] = useState("");
    const [participants, setParticipants] = useState([""]);
    const [loading, setLoading] = useState(false);

    const addParticipant = () => {
        setParticipants([...participants, ""]);
    };

    const updateParticipant = (index: number, value: string) => {
        const updated = [...participants];
        updated[index] = value;
        setParticipants(updated);
    };

    const createMeeting = async () => {
        if (!title.trim()) {
            alert("会議名を入力してください");
            return;
        }

        if (!purpose.trim()) {
            alert("会議の目的を入力してください");
            return;
        }

        if (participants.some((participant) => !participant.trim())) {
            alert("参加者のメールアドレスを入力してください");
            return;
        }

        setLoading(true);

        // ログイン中のユーザーを取得
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            alert("ログインしてください");
            setLoading(false);
            return;
        }

        // 会議をSupabaseに保存
        const { data: meeting, error: meetingError } = await supabase
            .from("meetings")
            .insert({
                title: title.trim(),
                purpose: purpose.trim(),
                owner_id: user.id,
                response_deadline: responseDeadline
                    ? new Date(responseDeadline).toISOString()
                    : null,

            })
            .select()
            .single();

        if (meetingError || !meeting) {
            console.error(meetingError);
            alert("会議の作成に失敗しました");
            setLoading(false);
            return;
        }

        // 参加者をSupabaseに保存
        const participantRows = participants.map((email) => ({
            meeting_id: meeting.id,
            email: email.trim(),
        }));

        const { error: participantError } = await supabase
            .from("participants")
            .insert(participantRows);

        if (participantError) {
            console.error(participantError);
            alert("参加者の登録に失敗しました");
            setLoading(false);
            return;
        }

        // 会議ページへ移動
        router.push(`/meeting/${meeting.id}`);
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center px-6 py-5">
                    <h1 className="text-2xl font-bold">NoMeet</h1>
                </div>
            </header>

            <section className="mx-auto max-w-2xl px-6 py-12">
                <div className="rounded-2xl bg-white p-8 shadow-sm">

                    <p className="text-sm font-semibold tracking-widest text-blue-600">
                        CREATE MEETING
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                        新しい会議を作成
                    </h2>

                    <p className="mt-3 text-gray-500">
                        会議の目的と参加者を設定してください。
                    </p>

                    <div className="mt-8 space-y-6">

                        {/* 会議名 */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                会議名
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例：新商品の価格について"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        {/* 目的 */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                会議の目的
                            </label>

                            <textarea
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="この会議で何を決めたいですか？"
                                rows={5}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold">
                                回答期限
                            </label>

                            <input
                                type="datetime-local"
                                value={responseDeadline}
                                onChange={(e) => setResponseDeadline(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div>

                        {/* 参加者 */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                参加者
                            </label>

                            <div className="space-y-3">
                                {participants.map((participant, index) => (
                                    <input
                                        key={index}
                                        type="email"
                                        value={participant}
                                        onChange={(e) =>
                                            updateParticipant(index, e.target.value)
                                        }
                                        placeholder="メールアドレス"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addParticipant}
                                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ＋ 参加者を追加
                            </button>
                        </div>

                        {/* 作成ボタン */}
                        <button
                            type="button"
                            onClick={createMeeting}
                            disabled={loading}
                            className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? "作成中..." : "会議を作成する"}
                        </button>

                    </div>
                </div>
            </section>
        </main>
    );
}