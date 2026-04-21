import crypto from 'crypto';

// ============================================================
// Auth · tokens de sesión de edición
// ============================================================
// Usamos HMAC firmado en vez de JWT para mantenerlo simple.
// El secreto vive en env, nunca en el cliente.
// El token expira en 2 horas.

const SECRET = process.env.EDIT_TOKEN_SECRET!;
const EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 horas

export type TokenPayload = {
  editorName: string;
  issuedAt: number;
  expiresAt: number;
};

function sign(data: string): string {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

export function createToken(editorName: string): string {
  const payload: TokenPayload = {
    editorName,
    issuedAt: Date.now(),
    expiresAt: Date.now() + EXPIRY_MS,
  };
  const raw = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(raw);
  return `${raw}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  if (!token || !token.includes('.')) return null;
  const [raw, signature] = token.split('.');
  if (!raw || !signature) return null;

  const expected = sign(raw);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload: TokenPayload = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf8')
    );
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
