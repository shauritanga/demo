"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setIsLoading(false);
      console.log({ result });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to home page on successful login
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with illustration */}
      <div className="bg-[url('https://images.unsplash.com/photo-1634638023542-ece6e86710ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODR8fHNoaXBwaW5nfGVufDB8fDB8fHww')] bg-cover bg-center relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#B5CCBE] text-white"></div>

      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/djk_logo.png"
              alt="Acme"
              width={200}
              height={200}
              className="mb-3"
            />
            <h2 className="text-xl text-gray-600">Welcome to CMTL Logistics</h2>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-500" htmlFor="email">
                Users name or Email
              </label>
              <Input
                id="email"
                defaultValue="Shauritanga"
                className="w-full p-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                defaultValue="password"
                className="w-full p-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Forget password?
                </Link>
              </div>
            </div>
            <Button className="w-full bg-[#f38633] hover:bg-[#d4915e] text-white">
              {isLoading ? "Signing..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
