'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Breach {
    Name: string;
    BreachDate: string;
    PwnCount: number;
    Description: string;
}

interface ResultsCardProps {
    breaches: Breach[];
    type: 'email' | 'password';
    onClose: () => void;
}

export default function ResultsCard({ breaches = [], type, onClose }: ResultsCardProps) {
    const isEmail = type === 'email';
    const validBreaches = Array.isArray(breaches) ? breaches : [];
    const severityColor = validBreaches.length > 1 ? 'red' : validBreaches.length === 1 ? 'yellow' : 'green';

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative max-w-lg w-full mx-4 p-6 bg-white rounded-xl shadow-2xl`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {validBreaches.length === 0 ? (
                    <div className="text-center py-6">
                        <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-green-700 mb-2">
                            {isEmail ? 'Email безопасен!' : 'Пароль надежный!'}
                        </h3>
                        <p className="text-green-600">
                            {isEmail
                                ? 'Ваш email не найден в известных утечках данных'
                                : 'Этот пароль соответствует всем требованиям безопасности'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center mb-6">
                            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {isEmail ? 'Обнаружены утечки!' : 'Обнаружены проблемы!'}
                            </h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            {validBreaches.map((breach, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 bg-white rounded-lg shadow border-l-4 border-red-500"
                                >
                                    <h4 className="font-semibold text-gray-800 mb-2">{breach.Name}</h4>
                                    <p className="text-gray-600 mb-2">{breach.Description}</p>
                                    {breach.PwnCount > 0 && (
                                        <p className="text-sm text-gray-500">
                                            Обнаружено в {breach.PwnCount.toLocaleString()} случаях
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Рекомендации:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                {isEmail ? (
                                    <>
                                        <li>Включите двухфакторную аутентификацию</li>
                                        <li>Регулярно меняйте пароль</li>
                                        <li>Используйте уникальные пароли для каждого сервиса</li>
                                        <li>Проверяйте входящие письма на фишинг</li>
                                    </>
                                ) : (
                                    <>
                                        <li>Используйте длинный пароль (минимум 12 символов)</li>
                                        <li>Комбинируйте буквы, цифры и специальные символы</li>
                                        <li>Избегайте личной информации в пароле</li>
                                        <li>Используйте менеджер паролей</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
} 