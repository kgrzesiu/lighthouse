
export const MAX_RANDOM_VALUE = 100000;

/**
 * Преобразовать токен в объект
 * @param token
 */
export function  parseJwt (token: string) {
    if (token === '') {return {}}
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

/**
 * Случайное значение
 * @param max Максимальное значение
 */
export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}