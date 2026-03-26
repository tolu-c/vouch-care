import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import AuthHeader from "#/components/auth/AuthHeader";
import FormError from "#/components/form/FormError";
import { AUTH_SELECT_INPUT_CLASS, AUTH_TEXT_INPUT_CLASS } from "#/components/form/formClasses";
import SubmitButton from "#/components/form/SubmitButton";
import { validateHmoId, validateRequiredSelection } from "#/lib/formValidators";

export const Route = createFileRoute("/_auth/link-hmo")({ component: LinkHmoPage });

const CLOUD_BG = {
  background:
    "linear-gradient(155deg, #a4c0d8 0%, #b8d2e8 20%, #c8dff0 40%, #d8ecf8 60%, #e8f3fc 80%, #f4f9fd 100%)",
};

const HMO_OPTIONS = [
  "Hygeia HMO",
  "Reliance HMO",
  "Leadway Health",
  "Avon HMO",
  "AXA Mansard",
  "Total Energies",
  "Clearline HMO",
];

function LinkHmoPage() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      hmoId: "",
      selectedHmo: "",
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      void navigate({ to: "/verify" });
    },
  });

  return (
    <div className="flex flex-col min-h-screen" style={CLOUD_BG}>
      <AuthHeader />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Large moon — center-left */}
        <div
          className="absolute rounded-full pointer-events-none select-none"
          style={{
            width: "420px",
            height: "420px",
            background:
              "radial-gradient(circle at 38% 32%, #f8f8fc, #dce4ef 45%, #c0ccd8 72%, #a8b8cc)",
            boxShadow:
              "inset -10px -10px 24px rgba(0,0,0,0.1), inset 8px 8px 20px rgba(255,255,255,0.5)",
            opacity: 0.75,
            top: "50%",
            left: "32%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        />

        {/* Page content */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row gap-10 items-center justify-center">
          {/* Left: Illustration */}
          <div className="w-full md:w-[46%] flex items-center justify-center">
            <img
              src="/digital-payment.svg"
              alt="Digital payment celebration illustration"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain drop-shadow-lg"
              aria-hidden="true"
            />
          </div>

          {/* Right: Form card */}
          <div
            className="w-full md:w-[54%] max-w-sm rounded-2xl p-8 shadow-md"
            style={{ backgroundColor: "#ddd9ce" }}
          >
            <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-2">
              SUCCESSFUL!
            </h1>
            <p className="text-slate-500 text-sm mb-7">Now link your account to your HMO</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="hmoId"
                validators={{
                  onChange: ({ value }) => validateHmoId(value),
                }}
              >
                {(field) => (
                  <div>
                    <input
                      type="text"
                      placeholder="HMO ID"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={AUTH_TEXT_INPUT_CLASS}
                      aria-label="HMO ID"
                    />
                    <FormError
                      show={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                      error={field.state.meta.errors[0]}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="selectedHmo"
                validators={{
                  onChange: ({ value }) => validateRequiredSelection(value, "an HMO"),
                }}
              >
                {(field) => (
                  <div>
                    <div className="relative">
                      <ChevronDown
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      />
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-label="Select HMO"
                        className={AUTH_SELECT_INPUT_CLASS}
                      >
                        <option value="">SELECT HMO</option>
                        {HMO_OPTIONS.map((hmo) => (
                          <option key={hmo} value={hmo}>
                            {hmo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FormError
                      show={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                      error={field.state.meta.errors[0]}
                    />
                  </div>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <SubmitButton
                    canSubmit={canSubmit}
                    isSubmitting={isSubmitting}
                    idleLabel="LINK UP"
                    submittingLabel="LINKING..."
                    className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.16em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
    </div>
  );
}
