import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized!!" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // ✅ safer: attach to req.user instead of req.body
      req.user = { id: tokenDecode.id };
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
