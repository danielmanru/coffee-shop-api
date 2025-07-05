import bcrypt from 'bcrypt';
import User from "../src/models/user.model.js";

const removeTestUser = async () => {
  await User.deleteOne({email: "piceso3624@dxirl.com"})
}

const createTestUser = async (role) => {
  const hashedPassword = await bcrypt.hash("K5gb#mpg", 10);
  await User.create({
    name: "Piceso",
    email: "piceso3624@dxirl.com",
    password: hashedPassword,
    phone: "081299998888",
    role: role
  })
}

const verifyUser = async () => {
  await User.findOneAndUpdate({email: "piceso3624@dxirl.com"},
    { $set: {isVerified: true} });
}

export{
  removeTestUser,
  createTestUser,
  verifyUser
}