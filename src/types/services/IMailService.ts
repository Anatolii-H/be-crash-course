export interface IMailService {
  send(options: {
    to: string;
    from: string;
    templateId: string;
    vars: Record<string, string>;
  }): Promise<void>;
}
