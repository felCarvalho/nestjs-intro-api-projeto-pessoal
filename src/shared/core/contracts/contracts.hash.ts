export abstract class HashContract {
  abstract setHash(password: string): Promise<this>;
  abstract setCompare(password: string, hash: string): Promise<boolean>;
}
