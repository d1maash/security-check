'use client';

import { useState } from 'react';
import ResultsCard from './ResultsCard';

export default function CheckForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailBreaches, setEmailBreaches] = useState<any[]>([]);
    const [passwordBreaches, setPasswordBreaches] = useState<any[]>([]);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [showEmailResults, setShowEmailResults] = useState(false);
    const [showPasswordResults, setShowPasswordResults] = useState(false);

    const handleEmailCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailLoading(true);
        try {
            const response = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: email }),
            });
            const data = await response.json();
            setEmailBreaches(Array.isArray(data.breaches) ? data.breaches : []);
            setShowEmailResults(true);
        } catch (error) {
            console.error('Error:', error);
            setEmailBreaches([]);
        }
        setIsEmailLoading(false);
    };

    const handlePasswordCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordLoading(true);
        setShowPasswordResults(false);

        try {
            const response = await fetch('/api/check-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: password }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при проверке пароля');
            }

            const data = await response.json();

            const breaches = Array.isArray(data.breaches) ? data.breaches : [];
            setPasswordBreaches(breaches);
            setShowPasswordResults(true);

        } catch (error) {
            console.error('Error:', error);
            setPasswordBreaches([{
                Name: 'Ошибка проверки',
                BreachDate: new Date().toISOString(),
                PwnCount: 0,
                Description: 'Произошла ошибка при проверке пароля. Пожалуйста, попробуйте еще раз.'
            }]);
            setShowPasswordResults(true);
        }

        setIsPasswordLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Форма проверки email */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Проверка Email</h2>
                <form onSubmit={handleEmailCheck} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Введите email для проверки
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder="example@domain.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isEmailLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
                    >
                        {isEmailLoading ? 'Проверка...' : 'Проверить Email'}
                    </button>
                </form>
                {showEmailResults && (
                    <ResultsCard
                        breaches={emailBreaches}
                        type="email"
                        onClose={() => setShowEmailResults(false)}
                    />
                )}
            </div>

            {/* Форма проверки пароля */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Проверка Пароля</h2>
                <form onSubmit={handlePasswordCheck} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Введите пароль для проверки
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isPasswordLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-400"
                    >
                        {isPasswordLoading ? 'Проверка...' : 'Проверить Пароль'}
                    </button>
                </form>
                {showPasswordResults && (
                    <ResultsCard
                        breaches={passwordBreaches}
                        type="password"
                        onClose={() => setShowPasswordResults(false)}
                    />
                )}
            </div>
        </div>
    );
} 