
export class CustomError extends Error {
    status: number;
    additionalInfo: string;
  
    constructor(message: string, status: number, additionalInfo: string) {
      super(message);
      this.name = 'CustomError';
      this.status = status;
      this.additionalInfo = additionalInfo;

    }
  }