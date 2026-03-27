import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import AuthCloudLayout from "@/components/auth/AuthCloudLayout";
import FormError from "@/components/form/FormError";
import { AUTH_TEXT_INPUT_CLASS } from "@/components/form/formClasses";
import SubmitButton from "@/components/form/SubmitButton";
import { validateContact } from "@/lib/formValidators";

const FORGOT_IMAGE =
  "https://images.pexels.com/photos/5327864/pexels-photo-5327864.jpeg?auto=compress&cs=tinysrgb&w=700";

export const Route = createFileRoute("/_auth/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      contact: "",
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      void navigate({ to: "/verify" });
    },
  });

  return (
    <AuthCloudLayout
      imageUrl={FORGOT_IMAGE}
      imageAlt="Female doctor discussing results with patient using a tablet — Thirdman on Pexels"
    >
      <div className="rounded-2xl p-7 sm:p-9 shadow-md" style={{ backgroundColor: "#ddd9ce" }}>
        <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-2">
          Forgot Password?
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Enter you email or phone number to reset it.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
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

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <SubmitButton
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
                idleLabel="Reset Password"
                submittingLabel="RESETTING..."
                className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.12em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
    </AuthCloudLayout>
  );
}
