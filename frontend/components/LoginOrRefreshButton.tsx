import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {MessageCircle, RefreshCcwIcon} from "lucide-react";
import {useLanguage} from "@/lib/language-context";

interface LoginOrRefreshButtonProps {
    loginText?: string|null
}

function LoginOrRefreshButton({loginText}: LoginOrRefreshButtonProps) {
    const [clickedLogin, setClickedLogin] = useState(false);
    const {t} = useLanguage();

    const handleLoginClick = () => {
        // Mémorise qu'on a ouvert la page de login
        // localStorage.setItem("clickedLogin", "true");
        setClickedLogin(true);
        window.open("/signin", "_blank", "noopener,noreferrer");
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Button
            className="w-full gap-2 cursor-pointer"
            size="lg"
            onClick={clickedLogin ? handleRefresh : handleLoginClick}
        >
            {clickedLogin ? <RefreshCcwIcon className={'w-5 h-5'}/> : <MessageCircle className="w-5 h-5"/>}
            {clickedLogin ? t('refresh') : (loginText ?? t('auth.signIn'))}
        </Button>
    );
}

export default LoginOrRefreshButton;
