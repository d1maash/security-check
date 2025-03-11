import CheckForm from './components/CheckForm';
import PasswordGenerator from './components/PasswordGenerator';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Проверка безопасности
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Проверьте, не утекли ли ваши данные, и создайте надежный пароль
                </p>

                <div className="max-w-4xl mx-auto space-y-8">
                    <CheckForm />
                    <PasswordGenerator />
                </div>
            </div>
        </main>
    );
} 