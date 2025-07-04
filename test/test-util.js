import bcrypt from 'bcrypt';
import User from "../src/models/user.model.js";

const removeTestUser = async () => {
  await User.deleteOne({email: "hanyatester@gmail.com"})
}

const createTestUser = async (role) => {
  await User.create({
    name: "Temalo",
    email: "temalo7083@exitbit.com",
    password: "K5gb#mpg",
    phone: "081299998888",
    role: role
  })
}

const verifyUser = async () => {
  await User.findOneAndUpdate({email: "temalo7083@exitbit.com"},
    { $set: {isVerified: true} });
}

export{
  removeTestUser,
  createTestUser
}