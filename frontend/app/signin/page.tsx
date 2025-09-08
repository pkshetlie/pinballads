"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialisation du router
  const { t } = useLanguage()
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await login(email, password);
      // Rediriger l'utilisateur après connexion (par exemple vers le dashboard)
      router.push('/'); // Redirige vers la page d'accueil
    } catch (error) {
      setErrorMessage(t('auth.invalidCredentials') || 'Invalid email or password'); // Message par défaut si traduction non disponible
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground">{t('auth.signInToAccount')}</p>
          </div>

          <Card className="shadow-lg border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('auth.signIn')}</CardTitle>
              <CardDescription className="text-center">
                {t('auth.enterEmail')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder={t('auth.enterEmail')} className="pl-10" required
                           onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('auth.enterPassword')}
                      className="pl-10 pr-10"
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      {t('auth.rememberMe')}
                    </Label>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:text-primary/80">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                {errorMessage && (
                    <p className="text-sm text-red-600 text-center">
                      {errorMessage}
                    </p>
                )}

                <Button type="submit" className="w-full">
                  {t('auth.signIn')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                {/*<div className="relative flex justify-center text-xs uppercase">*/}
                {/*  <span className="bg-card px-2 text-muted-foreground">{t('auth.orContinueWith')}</span>*/}
                {/*</div>*/}
              </div>

              {/*<div className="grid grid-cols-2 gap-4">*/}
              {/*  <Button variant="outline" className="w-full bg-transparent">*/}
              {/*    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">*/}
              {/*      <path*/}
              {/*        fill="currentColor"*/}
              {/*        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"*/}
              {/*      />*/}
              {/*      <path*/}
              {/*        fill="currentColor"*/}
              {/*        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"*/}
              {/*      />*/}
              {/*      <path*/}
              {/*        fill="currentColor"*/}
              {/*        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"*/}
              {/*      />*/}
              {/*      <path*/}
              {/*        fill="currentColor"*/}
              {/*        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"*/}
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
                {t('auth.dontHaveAccount')}{" "}
                <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                  {t('auth.signUp')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
