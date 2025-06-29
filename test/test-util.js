import { prismaClient } from "../src/application/database"
import bcrypt from 'bcrypt';

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where:{
      email: "hanyatester@gmail.com"
    }
  })
}

const createTestUser = async () =>{
  await prismaClient.user.create({
    data:{
      email : "hanyatester@gmail.com",
      password : await bcrypt.hash("K5gb#mpg", 10),
      name : "Hanya Tester",
      birthDate : 1,
      birthMonth : 1,
      birthYear : 2002,
      gender : "MALE",
      phone : "081299998888",
      role : "HOST",
      token : "test",
    }
  })
}

export{
  removeTestUser,
  createTestUser
}