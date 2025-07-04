import supertest from "supertest";
import { web } from "../src/config/web.js"
import { removeTestUser, createTestUser } from "./test-util.js";
import * as emailUtil from "../src/utils/mailer2.js";

const path = "/api/v1"

jest.spyOn(emailUtil, "sendEmail").mockImplementation(() => Promise.resolve());
describe(`POST  ${path}/users`, function () {

  afterEach(async ()=>{
    await removeTestUser();
  });

  it('should can register new user', async () =>{
    const result = await supertest(web)
      .post(path+'/register')
      .send({
        name: "Temalo",
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg",
        phone: "081299998888",
        role: "customer"
      });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("User registered successfully");
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.name).toBe("Temalo");
    expect(result.body.data.email).toBe("temalo7083@exitbit.com");
    expect(result.body.data.password).toBeUndefined();
    expect(emailUtil.sendEmail).toHaveBeenCalledWith(
      "temalo7083@exitbit.com",
      "Verify your email",
      expect.stringContaining("We are pleased to welcome you! To get started, please verify your email address by clicking the button below.")
    );
  });

  it('should reject if request is invalid', async () =>{
    const result = await supertest(web)
      .post(path+'/register')
      .send({
        email : "hanyatestergmail.com",
        password : "klendestin",
        name : "",
        phone : "",
        role : "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });

  it('should reject if email already registered', async () =>{
    let result = await supertest(web)
      .post(path+'/register')
      .send({
        name: "Temalo",
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg",
        phone: "081299998888",
        role: "customer"
      });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("User registered successfully");
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.name).toBe("Temalo");
    expect(result.body.data.email).toBe("temalo7083@exitbit.com");
    expect(result.body.data.password).toBeUndefined();
    expect(emailUtil.sendEmail).toHaveBeenCalledWith(
      "temalo7083@exitbit.com",
      "Verify your email",
      expect.stringContaining("We are pleased to welcome you! To get started, please verify your email address by clicking the button below.")
    );

    result = await supertest(web)
      .post(path+'/register')
      .send({
        name: "Temalo",
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg",
        phone: "081299998888",
        role: "customer"
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });
});

describe(`POST ${path}/users/login`, function(){
  beforeEach(async () =>{
    await createTestUser("customer");
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can login', async () =>{
    const result = await supertest(web)
      .post(path+'/login')
      .send({
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg"
      });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Login successfully");
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.name).toBe("Temalo");
    expect(result.body.data.email).toBe("temalo7083@exitbit.com");
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject login if request is invalid', async () =>{
    const result = await supertest(web)
      .post(path+'/login')
      .send({
        email : "",
        password : "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject login if password is wrong', async () =>{
    const result = await supertest(web)
      .post(path+'/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "M5gb#mpg"
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject login if email is wrong', async () =>{
    const result = await supertest(web)
      .post(path+'/login')
      .send({
        email : "hanyatester11@gmail.com",
        password : "K5gb#mpg"
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

});

describe(`GET ${path}/users`, function(){
  beforeEach(async () =>{
    await createTestUser("customer");
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can get users information', async () =>{
    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .get(path+'/users/user')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Successfully get user data");
    expect(result.body.data.email).toBe("temalo7083@exitbit.com");
    expect(result.body.data.name).toBe("Temalo");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.phone).toBe("081299998888");
    expect(result.body.data.role).toBe("customer");
  });
});

describe("authMiddleware", function(){
  it('should reject if token is invalid', async () =>{
    const result = await supertest(web)
      .get(path+'/users/user')
      .set('Authorization', 'testing')

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });

  it('should reject if user role is not appropriate', async () =>{
    beforeEach(async () =>{
      await createTestUser("customer");
    });

    afterEach(async () =>{
      await removeTestUser();
    });

    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .post(path+'/outlets/addOutlet')
      .send({
        name: "testing",
        location: {
          alamat: "Jl. Testing",
          kelurahan: "testing timur",
          kecamatan: "testing kcamatan"
        },
        openingHours: {
          open: "07:05",
          close: "08:05",
        },
        isActive: true
      })
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });

  it('should reject if user is not verified', async () =>{
    beforeEach(async () =>{
      await createTestUser("admin");
    });

    afterEach(async () =>{
      await removeTestUser();
    });

    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .post(path+'/outlets/addOutlet')
      .send({
        name: "testing",
        location: {
          alamat: "Jl. Testing",
          kelurahan: "testing timur",
          kecamatan: "testing kcamatan"
        },
        openingHours: {
          open: "07:05",
          close: "08:05",
        },
        isActive: true
      })
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });
})

describe(`PUT ${path}/users/updateUserDetail`, function(){
  beforeEach(async () =>{
    await createTestUser("customer");
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can update users information', async () =>{
    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email: "temalo7083@exitbit.com",
        password: "K5gb#mpg"
      });

    const update = await supertest(web)
      .put(path+'/users/updateUserDetail')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .send({
        name : "Temalo",
        phone : "081299998888",
        location : {
          alamat: "Jl.tester no1",
          kecamatan: "testing kecamatan",
          kelurahan: "testing kelurahan",
          kota: "lampung"
        },
      })

    expect(update.status).toBe(200);
    expect(update.body.success).toBe(true);
    expect(update.body.message).toBe("Successfully get user data");
    expect(update.body.data.email).toBe("temalo7083@exitbit.com");
    expect(update.body.data.name).toBe("Temalo");
    expect(update.body.data.password).toBeUndefined();
    expect(update.body.data.phone).toBe("081299998888");
    expect(update.body.data.location.toBe({
      alamat: "Jl.tester no1",
      kecamatan: "testing kecamatan",
      kelurahan: "testing kelurahan",
      kota: "lampung"
    }));
    expect(update.body.data.role).toBe("customer");
  });
});

describe(`PUT ${path}/users/changePassword`, function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can update user password', async () =>{
    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    const update = await supertest(web)
      .put(path+'/users/changePassword')
      .set('Authorization',`Bearer ${login.body.data.token}`)
      .send({
        currentPassword : "K5gb#mpg",
        newPassword :  "M5gb#mpg",
      })

    expect(update.status).toBe(200);
    expect(update.body.message).toBe("Successfully update user data");
    expect(update.body.data.refreshToken).toBeDefined();
    expect(update.body.data.password).toBeUndefined();
  });

  it('should reject if user password and confirm user password is different', async () =>{
    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    const update = await supertest(web)
      .put(path+'/users/changePassword')
      .set('Authorization',`Bearer ${login.body.data.token}`)
      .send({
        currentPassword : "J5gb#mpg",
        newPassword :  "M5gb#mpg",
      })
    expect(update.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });
});

describe(`PUT ${path}+/users/logout` , function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can logged out user', async () =>{
    const login = await supertest(web)
      .post(path+'/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    const logout = await supertest(web)
      .put(path+'users/logout')
      .set('Authorization',`Bearer ${login.body.data.token}`)

    expect(logout.status).toBe(200);
    expect(logout.body.message).toBe("User successfully logged out");
    expect(logout.body.data).toBeNull();
  });
})

