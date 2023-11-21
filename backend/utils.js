import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      experience: user.experience,
      isAdmin: user.isAdmin,
      isAuthor: user.isAuthor,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};
