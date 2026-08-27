import { MessageSquare } from 'lucide-react';

type WakilProps = {
    isOpen?: boolean;
};

export default function WakilLogo({ isOpen }: WakilProps) {
    return (
        <div className={`flex ${isOpen && 'space-x-2'} items-center`}>
            <div className={`flex items-center justify-center ${isOpen ? 'h-10 w-10' : 'h-10 w-15'} rounded-xl bg-white/10 backdrop-blur-sm`}>
                <MessageSquare className='text-white ' size={24}/>
            </div>
            {isOpen && (<span className='text-white text-3xl font-semibold'>Wakil</span>)}
        </div>
    );
}