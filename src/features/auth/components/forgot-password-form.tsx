"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password reset request
      await new Promise((res) => setTimeout(res, 800));
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch {
      toast.error("Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden p-0 max-w-md w-full mx-auto shadow-lg">
      <CardContent className="p-6 md:p-8">
        {submitted ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-in">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Button type="submit" disabled={isLoading} className="w-full mt-2">
                {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <FieldDescription className="text-center mt-4">
                Remember your password?{" "}
                <Link href="/sign-in" className="font-semibold underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
