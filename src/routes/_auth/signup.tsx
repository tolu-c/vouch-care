import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import FormError from "@/components/form/FormError";
import { AUTH_PASSWORD_INPUT_CLASS, AUTH_TEXT_INPUT_CLASS } from "@/components/form/formClasses";
import SubmitButton from "@/components/form/SubmitButton";
import { validateConfirmPassword, validateContact, validatePassword } from "@/lib/formValidators";

export const Route = createFileRoute("/_auth/signup")({ component: SignupPage });

const CLOUD_BG = {
  background:
    "linear-gradient(155deg, #a4c0d8 0%, #b8d2e8 20%, #c8dff0 40%, #d8ecf8 60%, #e8f3fc 80%, #f4f9fd 100%)",
};

const MOON_STYLE: CSSProperties = {
  width: "380px",
  height: "380px",
  background: "radial-gradient(circle at 38% 32%, #f8f8fc, #dce4ef 45%, #c0ccd8 72%, #a8b8cc)",
  boxShadow: "inset -10px -10px 24px rgba(0,0,0,0.1), inset 8px 8px 20px rgba(255,255,255,0.5)",
  opacity: 0.72,
};

function SignupPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const form = useForm({
    defaultValues: {
      contact: "",
      password: "",
      confirm: "",
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      void navigate({ to: "/link-hmo" });
    },
  });

  return (
    <div className="flex flex-col min-h-screen" style={CLOUD_BG}>
      <AuthHeader />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Moon — large, slightly left */}
        <div
          className="absolute rounded-full pointer-events-none select-none"
          style={{
            ...MOON_STYLE,
            top: "50%",
            left: "18%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        />

        {/* Form card */}
        <div
          className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-2xl p-8 shadow-md"
          style={{ backgroundColor: "#ddd9ce" }}
        >
          <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-1 text-center">
            WELCOME!
          </h1>
          <p className="text-slate-500 text-sm mb-6 text-center">Enter your details to continue</p>

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
                    placeholder="Phone  Number or  Email"
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
                      autoComplete="new-password"
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

            <form.Field
              name="confirm"
              validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue("password");
                  return validateConfirmPassword(value, password);
                },
              }}
            >
              {(field) => (
                <div>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={AUTH_PASSWORD_INPUT_CLASS}
                      aria-label="Confirm password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                    <FormError show error={field.state.meta.errors[0]} />
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <SubmitButton
                  canSubmit={canSubmit}
                  isSubmitting={isSubmitting}
                  idleLabel="SIGN UP"
                  submittingLabel="SIGNING UP..."
                  className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.18em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              )}
            </form.Subscribe>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3535C8] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
