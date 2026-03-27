import { createFileRoute, Link } from "@tanstack/react-router";
import AuthHeader from "@/components/auth/AuthHeader";

import { LoginForm } from "@/pages/auth/login/login-form";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1698247888586-80f7f3e8cc84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85";

export const Route = createFileRoute("/_auth/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(145deg, #c4c4d0 0%, #ccccda 30%, #d4d4e0 60%, #c8c8d4 100%)",
      }}
    >
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left: stethoscope image */}
          <div className="w-full md:w-[58%] shrink-0 rounded-2xl overflow-hidden shadow-lg min-h-70 md:min-h-120">
            <img
              src={LOGIN_IMAGE}
              alt="Stethoscope and heart — Marek Studzinski on Unsplash"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Right: form card */}
          <div
            className="w-full md:w-[42%] rounded-2xl p-7 sm:p-9 shadow-md flex flex-col justify-center"
            style={{ backgroundColor: "#ddd9ce" }}
          >
            <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-1">
              WELCOME BACK!
            </h1>
            <p className="text-slate-500 text-sm mb-7">Enter your details to continue</p>

            <LoginForm />

            <p className="text-center text-slate-500 text-sm mt-6">
              Don&apos;t have an account yet?{" "}
              <Link to="/portal-select" className="text-[#3535C8] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
