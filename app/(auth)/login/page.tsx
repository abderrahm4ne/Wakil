import { LoginForm } from "@/components/auth/LoginForm"
import WakilLogo from "@/components/common/WakilLogo"

export default function Login(){
    return(
    <div className="relative flex items-center justify-center h-screen bg-black/90" >

        <div className="absolute inset-0 opacity-30 overflow-hidden">
            <div className="absolute top-40 -left-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 -right-40 w-80 h-80 bg-linear-to-r from-secondary/70 to-green-600/45 rounded-full blur-3xl"></div>
        </div>

        <div className="flex lg:h-3/4 w-3/4 rounded-2xl overflow-hidden z-10" style={{
        boxShadow: "-5px 4px 10px rgba(255, 255, 255, 0.1)"
    }}>
           
            {/* left side gradient */}
            <div className="hidden lg:flex lg:w-2/4 h-full relative overflow-hidden font-display">
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
            <div className="bg-black flex flex-col justify-center items-center md:space-y-10 space-y-8 lg:w-3/4 w-full h-full py-12 overflow-hidden font-display">

                {/* Welcoming */}
                <div className="flex flex-col items-start lg:w-[45%] w-[80%] space-y-2">
                    <h1 className="font-bold md:text-3xl text-xl font-sans tracking-tight text-nowrap">Welcome back</h1>
                    <h3 className="font-semibold md:text-md text-xs text-muted-foreground tracking-tight text-nowrap">Sign in to your account to continue</h3>
                </div>
                
                {/* login form */}
                <LoginForm />
            </div>

        </div>
    </div>
    )
}