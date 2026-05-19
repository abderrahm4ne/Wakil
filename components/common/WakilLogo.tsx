import { MessageSquare } from 'lucide-react';
// replaced with real logo
export default function WakilLogo(){
    return(
        <div className='flex space-x-2 items-center'>
            <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm'>
                <MessageSquare className='text-white h-7 w-7'/>
            </div>
            <span className='text-white text-3xl font-semibold'>Wakil</span>
        </div>
    )
}