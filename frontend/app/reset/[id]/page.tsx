"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import {useParams, useRouter, useSearchParams} from "next/navigation"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import {useApi} from "@/lib/api";
import {useLanguage} from "@/lib/language-context";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
        const params = useParams();

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const {apiPost} = useApi()
    const {t} = useLanguage()

    useEffect(() => {
        setToken(params.id)
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            setIsLoading(false)
            return
        }

        try {
            // Simulate API call to reset password
            apiPost(`/api/public/reset/${params.id}`,{password}).then(res => {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/signin")
                }, 8000)
            }).catch(err => {
                setError("Failed to reset password. The reset link may have expired. Please request a new one.")
            })
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background">
             <Navbar></Navbar>
                {/* Success Message */}
                <main className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto">
                        <Card className="shadow-lg border">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-2">{t('auth.successMessageTitle')}</h2>
                                        <p className="text-muted-foreground">
                                          {t('auth.successMessageDescription')}
                                        </p>
                                    </div>
                                    <Button onClick={() => router.push("/signin")} className="w-full">
                                      {t('auth.redirectButtonText')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
          <Navbar></Navbar>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.pageTitle')}</h1>
                        <p className="text-muted-foreground">{t('auth.instructions')}</p>
                    </div>

                    <Card className="shadow-lg border">
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">{t('auth.newPassword')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t('auth.passwordPlaceholder')}
                                            className="pl-10 pr-10"
                                            required
                                            disabled={!token || isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                            disabled={!token || isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t('auth.passwordCriteria')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">{t('auth.confirmNewPassword')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={t('auth.confirmNewPassword')}
                                            className="pl-10 pr-10"
                                            required
                                            disabled={!token || isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                            disabled={!token || isLoading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full cursor-pointer" disabled={!token || isLoading}>
                                    {isLoading ? t('auth.loadingButton') : t('auth.submitButton')}
                                </Button>
                            </form>

                            <div className="text-center text-sm text-muted-foreground">
                                {t('auth.rememberPassword')}{" "}
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
