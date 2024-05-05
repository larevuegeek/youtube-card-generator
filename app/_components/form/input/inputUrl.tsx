import React from 'react';

interface ButtonProps {
    placeholder: string,
    name: string,
    error: string|null
}

const InputUrl: React.FC<ButtonProps> = ({ name, placeholder, error }) => {
    
    let className = "block w-full text-sm rounded-lg px-5 py-4 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500";
    if(error) {
        className = "block w-full px-5 py-4 text-sm rounded-lg border border-red-500 ring-4 ring-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500";
    }

    return (
        <>
            <input type="url" name={name} placeholder={placeholder} className={className} />
        </>
    );
}

export default InputUrl;