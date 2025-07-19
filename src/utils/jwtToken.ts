import jwt from 'jsonwebtoken';
class JwtToken {
  static createJwt(Data: any, sicretKey: string, options: object): string {
    const jwtToken = jwt.sign(Data, sicretKey, options);
    return jwtToken;
  }

  /*  static verifyJwt(jwt:any,sicretKey:string){
        const Data = jwt.verify(jwt, sicretKey);
        return Data.id
    } */
}

export default JwtToken;
