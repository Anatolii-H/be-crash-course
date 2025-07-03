export interface ISignatureService {
  sign(options: { email: string; expiresAt: string }): Promise<string>;
  verify(options: { email: string; expiresAt: string; signature: string }): Promise<boolean>;
}
