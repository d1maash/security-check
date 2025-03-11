import { NextResponse } from 'next/server';
import { checkPassword } from '../../utils/securityCheck';

export async function POST(request: Request) {
    try {
        const { value } = await request.json();

        if (!value) {
            return NextResponse.json(
                { error: 'Пароль обязателен' },
                { status: 400 }
            );
        }

        const breaches = await checkPassword(value);
        return NextResponse.json({ breaches });
    } catch (error) {
        console.error('Error in password check:', error);
        return NextResponse.json(
            { error: 'Ошибка при проверке пароля' },
            { status: 500 }
        );
    }
} 