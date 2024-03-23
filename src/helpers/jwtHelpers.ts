import jwt, { JwtPayload, Secret } from "jsonwebtoken";



// generate token 
export const generateToken = (
    payload: { email: string; role: string },
    secret: Secret,
    expiresIn: string
  ) => {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
  
    return token;
  };



// verify token
 export const verifyToken = (token:string,secret:Secret)=>{
  return  jwt.verify(token, secret) as JwtPayload;
 }
