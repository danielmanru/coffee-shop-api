import supertest from "supertest";
import { web } from "../src/config/web.js"
import mongoose from "mongoose";
import {
  createTestMenu,
  createTestUser, removeTestMenu,
  removeTestUser,
  verifyUser
} from "./test-util.js";
import {fileURLToPath} from "url";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

const endpoint = '/api/v1/images'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await createTestUser("admin");
  await verifyUser();

});

afterAll(async () => {
  await removeTestUser();
  await mongoose.disconnect();
});

let menuCreated;
const publicIds = [];

describe(`POST  ${endpoint}/addImage/for/Menu`, function () {
  beforeEach(async()=>{
    menuCreated = await createTestMenu();
  })
  it('should can add new images', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = (fileName) => {
      return path.join(__dirname, 'test-assets/', fileName)
    };

    const result = await supertest(web)
      .post(endpoint + '/addImage/for/Menu?itemId=' + menuCreated._id)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .attach('images', filePath("Caramel Machiato 1.png"))
      .attach('images', filePath("Caramel Machiato 2.png"))

    menuCreated.images = result.body.data.images;
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Image added successfully");
    expect(result.body.data).toEqual({
      _id: expect.any(String),
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
        }],
      images: expect.arrayContaining([{
        url: expect.any(String),
        publicId: expect.any(String)
      }])
    });
  })
});

describe(`PUT  ${endpoint}/deleteImage/for/Menu`, function () {
  afterEach(async()=>{
    await removeTestMenu(menuCreated._id);
  })

  it('should can delete images', async () => {
    await menuCreated.images.map(item => publicIds.push(item.publicId));
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .put(endpoint + `/deleteImage/for/Menu?itemId=${menuCreated._id}&publicIds=${publicIds.join(',')}`)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Image deleted successfully");
    expect(result.body.data).toEqual({
      _id: expect.any(String),
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
        }],
      images: expect.any(Array)
    });
  })
});

