"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { t } = useLanguage()

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null) // Clear previous error messages
    setIsSubmitting(true)

    // Validate form (check passwords match)
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t("auth.passwordsDoNotMatch"))
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("https://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setErrorMessage(errorData.message || t("common.error"))
      } else {
        // Redirect or show success message
        alert(t("auth.registrationSuccess"))
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        })
      }
    } catch (error) {
      setErrorMessage(t("common.error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("auth.createAccount")}</h1>
            <p className="text-muted-foreground">{t("auth.fillDetailsToSignUp")}</p>
          </div>

          <Card className="shadow-lg border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t("auth.signUp")}</CardTitle>
              <CardDescription className="text-center">
                {t("auth.enterYourDetails")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.enterEmail")}
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.enterPassword")}
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Accept Terms */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({
                        ...prev,
                        acceptTerms: checked
                      }))
                    }}
                    required
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    {t("auth.acceptTerms")}{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                      {t("auth.termsAndConditions")}
                    </Link>
                  </Label>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("common.loading") : t("auth.signUp")}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground mt-4">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">
                  {t("auth.signIn")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
