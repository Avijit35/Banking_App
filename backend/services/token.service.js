import jwt from "jsonwebtoken";

const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return {
      message: "There is no token !",
      isVerified: false,
    };
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return {
        message: "Invalid access token !",
        isVerified: false,
      };
    }
    return {
      message: "Token Verified !",
      isVerified: true,
      data: decode,
    };
  } catch (error) {
    return {
      message: "There is no token !",
      isVerified: false,
      error,
    };
  }
};

export { verifyToken };
