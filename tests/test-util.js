import bcrypt from 'bcrypt';
import User from "../src/models/user.model.js";
import Menu from "../src/models/menu.model.js";

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

const removeTestMenu = async (menuId, menuName = "") => {
  if (menuName != "") {
    return Menu.deleteOne({name: menuName})
  }
    return Menu.findByIdAndDelete(menuId)
}


const createTestMenu = async (role) => {
  return Menu.create({
    name: "Americano",
    description: "Kopi hitam nyaman diminum",
    category: "coffee",
    isAvailable: true,
    variants: [
      {
        size: "small",
        price: 10000
      },
      {
        size: "regular",
        price: 15000
      },
      {
        size: "large",
        price: 18000
      }]
  })
}

const verifyUser = async () => {
  await User.findOneAndUpdate({email: "piceso3624@dxirl.com"},
    { $set: {isVerified: true} });
}

export{
  removeTestUser,
  createTestUser,
  verifyUser,
  createTestMenu,
  removeTestMenu,
}