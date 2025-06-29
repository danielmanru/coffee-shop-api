import supertest from "supertest";
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js";
import { removeTestUser, createTestUser } from "./test-util.js";

describe('POST  /api/users', function () {

  afterEach(async ()=>{
    await removeTestUser();
  });

  it('should can register new user', async () =>{
    const result = await supertest(web)
      .post('/api/users/register')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
        name : "Hanya Tester",
        birthDate : 1,
        birthMonth : 1,
        birthYear : 2002,
        gender : "MALE",
        phone : "081299998888",
        role : "HOST",
        token : "test",
      });
    logger.info(result.body)
    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("hanyatester@gmail.com");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.name).toBe("Hanya Tester");
    expect(result.body.data.birthDate).toBeUndefined();
    expect(result.body.data.birthMonth).toBeUndefined();
    expect(result.body.data.birthYear).toBeUndefined();
    expect(result.body.data.gender).toBeUndefined();
    expect(result.body.data.phone).toBeUndefined();
    expect(result.body.data.role).toBeUndefined();
    expect(result.body.data.token).toBeUndefined();
  });

  it('should reject if request is invalid', async () =>{
    const result = await supertest(web)
      .post('/api/users/register')
      .send({
        email : "hanyatestergmail.com",
        password : "klendestin",
        name : "",
        birthDate : "32",
        birthMonth : "13",
        birthYear : "",
        gender : "",
        phone : "",
        role : "",
        token : "test"
      });

    logger.info(result.body)
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });

  it('should reject if email already registered', async () =>{
    let result = await supertest(web)
      .post('/api/users/register')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
        name : "Hanya Tester",
        birthDate : 1,
        birthMonth : 1,
        birthYear : 2002,
        gender : 'MALE',
        phone : "081299998888",
        role : "HOST",
        token : "test"
      });
    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("hanyatester@gmail.com");
    expect(result.body.data.name).toBe("Hanya Tester");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.birthDate).toBeUndefined();
    expect(result.body.data.birthMonth).toBeUndefined();
    expect(result.body.data.birthYear).toBeUndefined();
    expect(result.body.data.gender).toBeUndefined();
    expect(result.body.data.phone).toBeUndefined();
    expect(result.body.data.role).toBeUndefined();
    expect(result.body.data.token).toBeUndefined();

    result = await supertest(web)
      .post('/api/users/register')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
        name : "Hanya Tester",
        birthDate : 1,
        birthMonth : 1,
        birthYear : 2002,
        gender : 'MALE',
        phone : "081299998888",
        role : "HOST",
        token : "test"
      });
    logger.info(result.body)
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });
});

describe('POST /api/users/login', function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can login', async () =>{
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("");
  });

  it('should reject login if request is invalid', async () =>{
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "",
        password : "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject login if password is wrong', async () =>{
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "M5gb#mpg",
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject login if email is wrong', async () =>{
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester11@gmail.com",
        password : "K5gb#mpg",
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

});

describe('GET /api/users/current', function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can get users information', async () =>{
    const login = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    expect(login.status).toBe(200);
    expect(login.body.data.token).toBeDefined();
    expect(login.body.data.token).not.toBe("");

    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${login.body.data.token}`)

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("hanyatester@gmail.com");
    expect(result.body.data.name).toBe("Hanya Tester");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.birthDate).toBe(1);
    expect(result.body.data.birthMonth).toBe(1);
    expect(result.body.data.birthYear).toBe(2002);
    expect(result.body.data.gender).toBe('MALE');
    expect(result.body.data.phone).toBe("081299998888");
    expect(result.body.data.role).toBeUndefined();
    expect(result.body.data.token).toBeUndefined();
  });

  it('should reject if token is invalid', async () =>{
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'testing')

    // logger.info(result.body);
    console.log(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });
});

describe('PUT /api/users/current/updateUserDetail', function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can update users information', async () =>{
    const login = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    logger.info(login.body);

    expect(login.status).toBe(200);
    expect(login.body.data.token).toBeDefined();
    expect(login.body.data.token).not.toBe("");

    const update = await supertest(web)
      .put('/api/users/current/updateUserDetail')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .send({
        name : "John Doe",
        birthDate : 19,
        birthMonth : 11,
        birthYear : 2005,
        gender : 'MALE',
        phone : "081299998886",
      })

    logger.info(update.body);

    expect(update.status).toBe(200);
    expect(update.body.data.email).toBe("hanyatester@gmail.com");
    expect(update.body.data.name).toBe("John Doe");
    expect(update.body.data.password).toBeUndefined();
    expect(update.body.data.birthDate).toBe(19);
    expect(update.body.data.birthMonth).toBe(11);
    expect(update.body.data.birthYear).toBe(2005);
    expect(update.body.data.gender).toBe('MALE');
    expect(update.body.data.phone).toBe("081299998886");
    expect(update.body.data.role).toBeUndefined();
    expect(update.body.data.token).toBeUndefined();
  });

  it('should reject if token is invalid', async () =>{
    const result = await supertest(web)
      .get('/api/users/current/updateUserDetail')
      .set('Authorization', 'testing')

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });
});

describe('PUT /api/users/current/changePassword', function(){
  beforeEach(async () =>{
    await createTestUser();
  });

  afterEach(async () =>{
    await removeTestUser();
  });

  it('should can update user password', async () =>{
    const login = await supertest(web)
      .post('/api/users/login')
      .send({
        email : "hanyatester@gmail.com",
        password : "K5gb#mpg",
      });

    logger.info(login.body);

    expect(login.status).toBe(200);
    expect(login.body.data.token).toBeDefined();
    expect(login.body.data.token).not.toBe("");

    const update = await supertest(web)
      .put('/api/users/current/changePassword')
      .set('Authorization',`Bearer ${login.body.data.token}`)
      .send({
        currentPassword : "K5gb#mpg",
        newPassword :  "M5gb#mpg",
      })

    logger.info(update.body);

    expect(update.status).toBe(200);
    expect(update.body.data.email).toBe("hanyatester@gmail.com");
    expect(update.body.data.name).toBe("Hanya Tester");
    expect(update.body.data.password).toBeUndefined();
    expect(update.body.data.birthDate).toBeUndefined();
    expect(update.body.data.birthMonth).toBeUndefined();
    expect(update.body.data.birthYear).toBeUndefined();
    expect(update.body.data.gender).toBeUndefined();
    expect(update.body.data.phone).toBeUndefined();
    expect(update.body.data.role).toBeUndefined();
    expect(update.body.data.token).toBeDefined();
  });

  it('should reject if token is invalid', async () =>{
    const result = await supertest(web)
      .get('/api/users/current/changePassword')
      .set('Authorization', 'testing')

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });
});
