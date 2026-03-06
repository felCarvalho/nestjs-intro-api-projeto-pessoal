export abstract class TransactionContract {
  abstract runTransaction(action: () => Promise<unknown>): Promise<unknown>;
}
