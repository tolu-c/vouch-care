import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AuthHeader from "#/components/auth/AuthHeader";
import FormError from "#/components/form/FormError";
import { AUTH_PASSWORD_INPUT_CLASS, AUTH_TEXT_INPUT_CLASS } from "#/components/form/formClasses";
import SubmitButton from "#/components/form/SubmitButton";
import { validateContact, validatePassword } from "#/lib/formValidators";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1698247888586-80f7f3e8cc84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85";

export const Route = createFileRoute("/_auth/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const form = useForm({
    defaultValues: {
      contact: "",
      password: "",
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      void navigate({ to: "/home" });
    },
  });

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
          <div className="w-full md:w-[58%] shrink-0 rounded-2xl overflow-hidden shadow-lg min-h-[280px] md:min-h-[480px]">
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="contact"
                validators={{
                  onChange: ({ value }) => validateContact(value),
                }}
              >
                {(field) => (
                  <div>
                    <input
                      type="text"
                      placeholder="Phone Number or  Email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={AUTH_TEXT_INPUT_CLASS}
                      aria-label="Phone number or email"
                      autoComplete="username"
                    />
                    <FormError
                      show={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                      error={field.state.meta.errors[0]}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => validatePassword(value),
                }}
              >
                {(field) => (
                  <div>
                    <div className="relative">
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={AUTH_PASSWORD_INPUT_CLASS}
                        aria-label="Password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormError
                      show={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                      error={field.state.meta.errors[0]}
                    />
                  </div>
                )}
              </form.Field>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-[#3535C8] text-sm font-medium hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <SubmitButton
                    canSubmit={canSubmit}
                    isSubmitting={isSubmitting}
                    idleLabel="LOGIN"
                    submittingLabel="LOGGING IN..."
                    className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.18em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}
              </form.Subscribe>
            </form>

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
