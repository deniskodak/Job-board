export interface LoginResponse {
    token: string;
}

export type User = {
    id: string;
    email: string;
}

export interface JWRClaims {
    sub: User['id'];
    email: User['email'];
}