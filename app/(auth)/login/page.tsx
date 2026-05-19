import { LoginForm } from "@/components/auth/LoginForm"
import WakilLogo from "@/components/common/WakilLogo"

export default function Login(){
    return(
    <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex h-3/4 w-3/4 rounded-2xl overflow-hidden ">
           
            {/* left side gradient */}
            <div className="hidden lg:flex lg:w-1/2 h-full w-1/3 relative overflow-hidden font-display">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A9E6E_50%,#0D6E7A)]"/>

                <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl" />


                <div className="relative z-10 flex flex-col justify-between p-12">
                    
                    <WakilLogo />
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white text-balance ">
                        Your AI-powered DM assistant
                        </h1>
                        <p className="text-lg text-white/70 max-w-md">
                        Automate your direct messages, engage with your audience, and grow your presence effortlessly.
                        </p>
                    </div>
                    
                    <p className="text-sm text-white/90">
                        © 2026 Wakil. All rights reserved.
                    </p>
                    </div>
            </div>

            {/* right side form */}
            <div className="bg-black flex flex-col justify-center items-center space-y-10 w-2/3 h-full overflow-hidden font-display ">

                {/* Welcoming */}
                <div className="flex flex-col items-start w-[45%] space-y-2">
                    <h1 className="font-bold text-3xl font-sans tracking-tight">Welcome back</h1>
                    <h3 className="font-semibold text-md text-muted-foreground tracking-tight">Sign in to your account to continue</h3>
                </div>
                
                {/* login form */}
                <LoginForm />
            </div>

        </div>
    </div>
    )
}