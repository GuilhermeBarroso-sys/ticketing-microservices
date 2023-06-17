export type TError = {
  message: string;
  field?: string | number;
}

abstract class CustomError extends Error {
  abstract statusCode : number;
  abstract serializeErrors() : Array<TError> 

  constructor(message : string)  {
  	super(message);
  	Object.setPrototypeOf(this, CustomError.prototype);
  }
}


export { CustomError };