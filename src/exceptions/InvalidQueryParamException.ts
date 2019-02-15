export class InvalidQueryParamException extends Error {
  public status: number = 500;
  public param: string;
  public paramValue: any;
  public name: string = 'InvalidQueryParamException';

  constructor(param: string, paramValue: any) {
    super('An invalid QueryParam has been given');
    this.param = param;
    this.paramValue = paramValue;
  }
}

export default InvalidQueryParamException;
