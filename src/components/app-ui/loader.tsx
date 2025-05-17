import React from 'react';

import { Ripple } from '../magicui/ripple';
import Logo from './logo';

const Loader: React.FC = () => {
    return (
        <div className='flex relative w-full items-center justify-center'>
            <div>
                <Ripple
                    mainCircleSize={100}
                    mainCircleOpacity={0.8}
                    numCircles={8}
                    className='bg-primary/25 z-[2]'
                />
            </div>
            <div className='flex absolute z-[3] flex-col items-center justify-center gap-1'>
                <Logo className='size-12' />
            </div>
        </div>
    );
};

export default Loader;
