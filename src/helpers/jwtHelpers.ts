import jwt from "jsonwebtoken";



export const generateToken = (
    payload: { email: string; role: string },
    secret: string,
    expiresIn: string
  ) => {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
  
    return token;
  };

