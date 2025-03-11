import { NextResponse } from 'next/server';
import { checkEmail } from '../../utils/securityCheck';

export async function POST(request: Request) {
    try {
        const { value } = await request.json();

        if (!value) {
            return NextResponse.json(
                { error: 'Email обязателен' },
                { status: 400 }
            );
        }

        const breaches = await checkEmail(value);
        return NextResponse.json({ breaches });
    } catch (error) {
        console.error('Error checking email:', error);
        return NextResponse.json(
            { error: 'Ошибка при проверке email' },
            { status: 500 }
        );
    }
} 