interface CommonBreaches {
    [key: string]: {
        domain: string;
        date: string;
        count: number;
        description: string;
    };
}

// Симуляция базы данных известных утечек
const commonEmailDomains: CommonBreaches = {
    'gmail.com': {
        domain: 'Google/Gmail',
        date: '2023-09-15',
        count: 1000000,
        description: 'Массовая утечка данных пользователей Gmail в результате фишинговой атаки',
    },
    'yahoo.com': {
        domain: 'Yahoo',
        date: '2023-07-20',
        count: 500000,
        description: 'Компрометация учетных данных пользователей Yahoo',
    },
    'mail.ru': {
        domain: 'Mail.ru',
        date: '2023-08-10',
        count: 300000,
        description: 'Утечка базы данных пользователей Mail.ru',
    },
};

export async function checkEmail(email: string) {
    const breaches: any[] = [];

    try {
        // Проверяем домен через бесплатный API
        const emailHash = encodeURIComponent(email);
        const response = await fetch(`https://haveibeenpwned.com/unifiedsearch/${emailHash}`, {
            headers: {
                'User-Agent': 'PasswordSecurityChecker'
            }
        });

        // Если найдены утечки
        if (response.ok) {
            const data = await response.json();
            if (data.Breaches) {
                breaches.push(...data.Breaches.map((breach: any) => ({
                    Name: breach.Name,
                    BreachDate: breach.BreachDate,
                    PwnCount: breach.PwnCount,
                    Description: breach.Description
                })));
            }
        }

        // Если статус 404, значит утечек не найдено
        if (response.status === 404) {
            return [];
        }
    } catch (error) {
        console.error('Error checking email:', error);
    }

    // Дополнительная локальная проверка
    if (email.includes('admin') || email.includes('root') || email.includes('test')) {
        breaches.push({
            Name: 'Потенциально опасный email',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 50000,
            Description: 'Этот email использует распространенные слова, которые часто становятся целью атак'
        });
    }

    // Проверка на распространенные домены с историей утечек
    const domain = email.split('@')[1]?.toLowerCase();
    const riskyDomains = {
        'yahoo.com': 'Yahoo (множественные утечки)',
        'aol.com': 'AOL (исторические утечки)',
        'hotmail.com': 'Hotmail (старые утечки)'
    };

    if (domain && domain in riskyDomains) {
        breaches.push({
            Name: riskyDomains[domain as keyof typeof riskyDomains],
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 100000,
            Description: 'Этот домен электронной почты имеет историю утечек данных. Рекомендуется использовать современный почтовый сервис с двухфакторной аутентификацией.'
        });
    }

    return breaches;
}

// Правила для проверки надежности пароля
const passwordRules = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
    commonPasswords: new Set([
        'password123',
        '12345678',
        'qwerty123',
        'admin123',
        'letmein',
        'welcome',
        'monkey123',
        'football',
        'abc123',
        'password1',
        'qwerty',
        'qwerty12345',
        '123456',
        '123456789',
        'qwerty123456',
        '1234567890',
        'password',
        '12345',
        'dragon',
        'baseball',
        'football',
        'monkey',
        'letmein',
        'shadow',
        'master',
        '666666',
        'qwertyuiop',
        '123321',
        'mustang',
        'access',
        'michael',
        'superman',
        '696969',
        '123qwe',
        'jesus',
        'password1',
        'superstar',
        'hello123',
        'charlie',
        '888888',
        'donald',
        'freedom',
        '777777',
        'qazwsx',
        'trustno1',
        'rush2112',
        'admin',
        'welcome',
        'login',
        'starwars',
    ]),
    commonPatterns: [
        /^123/,
        /^qwerty/,
        /^admin/,
        /^pass/,
        /^welcome/,
        /^login/,
        /^user/,
        /password/i,
        /^abc/,
        /^test/,
        /^guest/,
    ]
};

export async function checkPassword(password: string) {
    const breaches: any[] = [];

    // 1. Проверка на пустой пароль или слишком короткий
    if (!password || password.length < 8) {
        breaches.push({
            Name: 'Слишком короткий пароль',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 1000000,
            Description: 'Пароль должен содержать минимум 8 символов'
        });
        return breaches;
    }

    // 2. Проверка на простые пароли из списка
    if (passwordRules.commonPasswords.has(password.toLowerCase())) {
        breaches.push({
            Name: 'Распространенный пароль',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 1000000,
            Description: 'Этот пароль входит в список самых распространенных паролей. Он легко подбирается и часто используется в атаках.'
        });
    }

    // 3. Проверка на распространенные паттерны
    for (const pattern of passwordRules.commonPatterns) {
        if (pattern.test(password.toLowerCase())) {
            breaches.push({
                Name: 'Предсказуемый пароль',
                BreachDate: new Date().toISOString().split('T')[0],
                PwnCount: 300000,
                Description: 'Пароль содержит распространенную последовательность символов, которая легко угадывается'
            });
            break;
        }
    }

    // 4. Проверка на последовательности
    if (/123|234|345|456|567|678|789/.test(password) ||
        /qwerty|asdfgh|zxcvbn/.test(password.toLowerCase())) {
        breaches.push({
            Name: 'Простая последовательность',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 200000,
            Description: 'Пароль содержит простые последовательности клавиш или цифр'
        });
    }

    // 5. Проверка сложности
    const weaknesses: string[] = [];
    if (!passwordRules.hasUpperCase.test(password)) weaknesses.push('нет заглавных букв');
    if (!passwordRules.hasLowerCase.test(password)) weaknesses.push('нет строчных букв');
    if (!passwordRules.hasNumbers.test(password)) weaknesses.push('нет цифр');
    if (!passwordRules.hasSpecialChar.test(password)) weaknesses.push('нет специальных символов');

    if (weaknesses.length > 0) {
        breaches.push({
            Name: 'Недостаточно сложный пароль',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 500000,
            Description: `Выявлены следующие недостатки: ${weaknesses.join(', ')}. Добавьте разные типы символов для усиления пароля.`
        });
    }

    // 6. Проверка на повторяющиеся символы
    if (/(.)\1{2,}/.test(password)) {
        breaches.push({
            Name: 'Повторяющиеся символы',
            BreachDate: new Date().toISOString().split('T')[0],
            PwnCount: 100000,
            Description: 'Пароль содержит повторяющиеся символы, что делает его более предсказуемым'
        });
    }

    // 7. Проверка через API
    try {
        const hash = await sha1(password);
        const prefix = hash.substring(0, 5).toUpperCase();
        const suffix = hash.substring(5).toUpperCase();

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

        if (response.ok) {
            const text = await response.text();
            const hashes = text.split('\n');
            const match = hashes.find(h => h.split(':')[0] === suffix);

            if (match) {
                const [, count] = match.split(':');
                breaches.push({
                    Name: 'Пароль найден в утечках',
                    BreachDate: new Date().toISOString().split('T')[0],
                    PwnCount: parseInt(count),
                    Description: `Этот пароль был обнаружен ${parseInt(count).toLocaleString()} раз(а) в различных утечках данных. Настоятельно рекомендуется использовать другой пароль.`
                });
            }
        }
    } catch (error) {
        console.error('Error checking password:', error);
    }

    // Если нет проблем с паролем, возвращаем пустой массив
    return breaches;
}

// Функция для вычисления SHA-1 хеша
async function sha1(str: string) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
} 