"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "登録しました！確認メールが届いたら、メール内のリンクをクリックしてください。"
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          NoMeet
        </h1>

        <p className="text-center text-gray-500 mb-8">
          {isSignup ? "アカウントを作成" : "ログイン"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              メールアドレス
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              パスワード
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              minLength={6}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg py-3 font-medium"
          >
            {isSignup ? "アカウントを作成" : "ログイン"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-sm text-center text-gray-600">
            {message}
          </p>
        )}

        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
          className="w-full mt-6 text-sm text-blue-600"
        >
          {isSignup
            ? "すでにアカウントを持っています"
            : "新しくアカウントを作る"}
        </button>
      </div>
    </main>
  );
}