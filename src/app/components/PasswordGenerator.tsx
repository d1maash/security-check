'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });

    const generatePassword = () => {
        const charset = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        };

        let characters = '';
        if (options.uppercase) characters += charset.uppercase;
        if (options.lowercase) characters += charset.lowercase;
        if (options.numbers) characters += charset.numbers;
        if (options.symbols) characters += charset.symbols;

        if (!characters) {
            setPassword('');
            return;
        }

        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters[array[i] % characters.length];
        }

        setPassword(result);
    };

    const copyToClipboard = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            alert('Пароль скопирован!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Генератор надежных паролей
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Длина пароля: {length}
                    </label>
                    <input
                        type="range"
                        min="8"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    {Object.entries(options).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() =>
                                    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
                                }
                                className="rounded text-blue-600"
                            />
                            <span className="text-sm text-gray-700 capitalize">{key}</span>
                        </label>
                    ))}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={password}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                        placeholder="Сгенерированный пароль"
                    />
                    {password && (
                        <button
                            onClick={copyToClipboard}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                        >
                            Копировать
                        </button>
                    )}
                </div>

                <button
                    onClick={generatePassword}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Сгенерировать пароль
                </button>
            </div>
        </motion.div>
    );
} 