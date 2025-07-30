import supertest from "supertest";
import { web } from "../src/config/web.js"
import mongoose from "mongoose";
import {createTestMenu, createTestUser, removeTestMenu, removeTestUser, verifyUser} from "./test-util.js";

const path = '/api/v1/menus'
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await createTestUser("admin");
  await verifyUser();

});

afterAll(async () => {
  await removeTestUser();
  await mongoose.disconnect();
});

describe(`POST  ${path}/addMenu`, function () {
  afterEach(async ()=>{
    await removeTestMenu("", "Americano");
  });

  it('should can add new menu', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .post(path + '/addMenu')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success create menu");
    expect(result.body.data._id).toBeDefined();
    expect(result.body.data.name).toBe("Americano");
    expect(result.body.data.description).toBe("Kopi hitam nyaman diminum");
    expect(result.body.data.category).toBe("coffee");
    expect(result.body.data.isAvailable).toBe(true);
    expect(result.body.data.images).toEqual(expect.any(Array));
    expect(result.body.data.variants).toEqual([
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
    );
  })

  it('should reject if menu is already exists', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    await supertest(web)
      .post(path + '/addMenu')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });

    const result = await supertest(web)
      .post(path + '/addMenu')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBeDefined;
  })
});

describe(`GET  ${path}/getAllMenus`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });

  it('should get all menus', async () => {
    const result = await supertest(web)
      .get(path + '/')
    expect(result.body.data).toEqual(expect.arrayContaining([{
      _id: expect.any(String),
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
        }],
      images: expect.any(Array)
    }]))
  })
});

describe(`GET  ${path}/getMenuByCategory`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });

  it('should get menu by specific category', async () => {
    const result = await supertest(web)
      .get(path + '/getMenuByCategory/coffee')
    expect(result.body.data).toEqual(expect.arrayContaining([{
      _id: expect.any(String),
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
        }],
      images: expect.any(Array)
    }]))
  })
});

describe(`GET  ${path}/getAvailableMenu`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });

  it('should get menu that available', async () => {
    const result = await supertest(web)
      .get(path + '/getAvailableMenu')
    expect(result.body.data).toEqual(expect.arrayContaining([{
      _id: expect.any(String),
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
        }],
      images: expect.any(Array)
    }]))
  })
});

describe(`GET  ${path}/getMenuById`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });


  it('should get menu with specific id', async () => {
    const result = await supertest(web)
      .get(path + `/getMenuById/${menuCreated._id}`)
    expect(result.body.data).toEqual({
      _id: expect.any(String),
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
        }],
      images: expect.any(Array)
    })
  })
});

describe(`PUT  ${path}/updateMenu`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });

  it('should update menu with specific id', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .put(path + `/updateMenu?menuId=${menuCreated._id}`)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
        name: "Americano numero uno",
        description: "Kopi hitam nyaman diminum",
        category: "coffee",
        isAvailable: true,
        variants: [
          {
            size: "small",
            price: 8000
          },
          {
            size: "regular",
            price: 12000
          },
          {
            size: "large",
            price: 15000
          }]
      });

    expect(result.body.data).toEqual({
      _id: expect.any(String),
      name: "Americano numero uno",
      description: "Kopi hitam nyaman diminum",
      category: "coffee",
      isAvailable: true,
      variants: [
        {
          size: "small",
          price: 8000
        },
        {
          size: "regular",
          price: 12000
        },
        {
          size: "large",
          price: 15000
        }],
      images: expect.any(Array)
    })
  })
});

describe(`DELETE ${path}/deleteMenu`, function () {
  let menuCreated;
  beforeEach(async () =>{
    menuCreated = await createTestMenu();
  })

  afterEach(async ()=>{
    await removeTestMenu(menuCreated._id);
  });


  it('should delete menu with specific id', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .delete(path + `/deleteMenu?menuId=${menuCreated._id}`)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success delete menu");
    expect(result.body.data).toBe(null);
  })
});

