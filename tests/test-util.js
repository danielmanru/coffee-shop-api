import bcrypt from 'bcrypt';
import User from "../src/models/user.model.js";
import Menu from "../src/models/menu.model.js";
import Outlet from "../src/models/outlet.model.js";

const removeTestUser = async () => {
  await User.deleteOne({email: "donaca5537@cerisun.com"})
}

const createTestUser = async (role) => {
  const hashedPassword = await bcrypt.hash("K5gb#mpg", 10);
  await User.create({
    name: "Piceso",
    email: "donaca5537@cerisun.com",
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


const createTestMenu = async () => {
  return Menu.create({
    name: "Caramel Macchiato",
    description: "Kopi karamel nyaman diminum",
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

const removeTestOutlet = async (outletId, outletName = "") => {
  if (outletName != "") {
    return Outlet.deleteOne({name: outletName});
  }
    return Outlet.findByIdAndDelete(outletId);
}


const createTestOutlet = async () => {
  return Outlet.create({
    name: "Ringroad Medan",
    location: {
      alamat: "Jl. Ringroad No. 114",
      kecamatan: "Medan Sunggal",
      kelurahan: "Tanjung Sari"
    },
    openingHours: {
      open: "08:00",
      close: "22:00"
    },
    isActive:true
  })
}

const verifyUser = async () => {
  await User.findOneAndUpdate({email: "donaca5537@cerisun.com"},
    { $set: {isVerified: true} });
}

export{
  removeTestUser,
  createTestUser,
  verifyUser,
  createTestMenu,
  removeTestMenu,
  createTestOutlet,
  removeTestOutlet,
}