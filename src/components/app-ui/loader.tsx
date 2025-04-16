// components/Loader.tsx
import React from 'react';

import './css/loader.css';
import { BookOpen } from 'lucide-react';

const Loader: React.FC = () => {
    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <div className='loader'>
                <style>{``}</style>
                <div style={{ '--i': 1, '--inset': '44%' } as React.CSSProperties} className='box'>
                    <div className='logo'>
                        <BookOpen className='svg' />
                    </div>
                </div>
                <div style={{ '--i': 2, '--inset': '40%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 3, '--inset': '36%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 4, '--inset': '32%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 5, '--inset': '28%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 6, '--inset': '24%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 7, '--inset': '20%' } as React.CSSProperties} className='box'></div>
                <div style={{ '--i': 8, '--inset': '16%' } as React.CSSProperties} className='box'></div>
            </div>
        </div>
    );
};

export default Loader;
