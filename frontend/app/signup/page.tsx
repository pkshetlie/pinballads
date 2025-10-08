"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Link from "next/link"
import {ArrowLeft, Mail, Lock, Eye, EyeOff, User} from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Navbar from "@/components/Navbar";
import {Separator} from "@radix-ui/react-menu";
import config from "@/config";
export default function SignUpPage() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {t, currentLanguage, setLanguage} = useLanguage()
  const availableLanguages = [{code : "fr", name: 'Français'},{code: "en", name: 'English'}];

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null) // Clear previous error messages
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const name = formData.get("name") as string
    const terms = formData.get("terms") as string

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t('auth.passwordTooShort'))
      setIsLoading(false)
      return
    }

    if (!terms) {
      setError(t('auth.acceptTermsToContinue'))
      setIsLoading(false)
      return
    }

    // Validate form (check passwords match)
    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError(t("auth.passwordsDoNotMatch"))
      setIsLoading(false)
      return
    }

    try {
        const response = await fetch(`${config.API_BASE_URL}register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                username: formData.get('name'),
                language: currentLanguage,
            }),
        })
        if (!response.ok) {
            const errorData = await response.json()
            setError(errorData.message || t("common.error"))
        } else {
            // Redirect to signin page with email parameter
            const email = formData.get('email')
            window.location.href = `/signin?email=${encodeURIComponent(email as string)}`
        }
    } catch (error) {
      setError(t("common.error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-background">
      <Navbar/>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.signUpToWebsite')}</h1>
              <p className="text-muted-foreground">
                {t('auth.createAccountToStart')}
              </p>
            </div>

            <Card className="shadow-lg border">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">{t('auth.signUp')}</CardTitle>
                <CardDescription className="text-center">{t('auth.enterYourDetails')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.displayName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder={t('auth.enterYourDisplayName')}
                          className="pl-10"
                          required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t('auth.enterEmail')}
                          className="pl-10"
                          required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('auth.createPassword')}
                          className="pl-10 pr-10"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('auth.confirmPassword')}
                          className="pl-10 pr-10"
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('auth.language')}</Label>
                    <Select  defaultValue={currentLanguage} onValueChange={(value) => setLanguage(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('auth.selectLanguage')}/>
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanguages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" name="terms" value="accepted" />
                    <Label noFlex={true} htmlFor="terms" className="text-sm text-muted-foreground">
                      {t('auth.agreeToTerms')}{" "}
                      <Link href="/terms-of-service" target={'_blank'} className="text-primary hover:text-primary/80">
                        {t('auth.termsOfService')}
                      </Link>{" "}
                      {t('auth.and')}{" "}
                      <Link href="/privacy-policy" target={'_blank'} className="text-primary hover:text-primary/80">
                        {t('auth.privacyPolicy')}
                      </Link>
                    </Label>
                  </div>

                  {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                        {error}
                      </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('auth.creatingAccount'): t('auth.createAccount')}
                  </Button>
                </form>

                {/*<div className="relative">*/}
                {/*  <div className="absolute inset-0 flex items-center">*/}
                {/*    <Separator />*/}
                {/*  </div>*/}
                {/*  <div className="relative flex justify-center text-xs uppercase">*/}
                {/*    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-2 gap-4">*/}
                {/*  <Button variant="outline" className="w-full bg-transparent">*/}
                {/*    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">*/}
                {/*      <path*/}
                {/*          fill="currentColor"*/}
                {/*          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"*/}
                {/*      />*/}
                {/*      <path*/}
                {/*          fill="currentColor"*/}
                {/*          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"*/}
                {/*      />*/}
                {/*      <path*/}
                {/*          fill="currentColor"*/}
                {/*          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"*/}
                {/*      />*/}
                {/*      <path*/}
                {/*          fill="currentColor"*/}
                {/*          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"*/}
                {/*      />*/}
                {/*    </svg>*/}
                {/*    Google*/}
                {/*  </Button>*/}
                {/*  <Button variant="outline" className="w-full bg-transparent">*/}
                {/*    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">*/}
                {/*      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />*/}
                {/*    </svg>*/}
                {/*    Facebook*/}
                {/*  </Button>*/}
                {/*</div>*/}

                <div className="text-center text-sm text-muted-foreground">
                  {t('auth.alreadyHaveAccount')}{" "}
                  <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">
                    {t('auth.signIn')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  )
}
