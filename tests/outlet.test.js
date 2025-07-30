import supertest from "supertest";
import { web } from "../src/config/web.js"
import mongoose from "mongoose";
import {createTestOutlet, createTestUser, removeTestOutlet, removeTestUser, verifyUser} from "./test-util.js";

const path = '/api/v1/outlets'
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await createTestUser("admin");
  await verifyUser();

});

afterAll(async () => {
  await removeTestUser();
  await mongoose.disconnect();
});

describe(`POST  ${path}/addOutlet`, function () {
  afterEach(async ()=>{
    await removeTestOutlet("", "Ringroad Medan");
  });

  it('should can add new outlet', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .post(path+'/addOutlet')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success add new outlet");
    expect(result.body.data).toEqual({
      _id: expect.any(String),
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
      images: expect.any(Array),
      isActive:true
    });
  })

  it('should reject if outlet is already exists', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    await supertest(web)
      .post(path+'/addOutlet')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });

    const result = await supertest(web)
      .post(path+'/addOutlet')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
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
      });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.errors).toBeDefined;
  })
});

describe(`GET  ${path}/getAllOutlet`, function () {
  let outletCreated;
  beforeEach(async () =>{
    outletCreated = await createTestOutlet();
  })

  afterEach(async ()=>{
    await removeTestOutlet(outletCreated._id);
  });

  it('should get all outlet', async () => {

    const result = await supertest(web)
      .get(path + '/')

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success get all outlets");
    expect(result.body.data).toEqual(expect.arrayContaining([{
      _id: expect.any(String),
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
      images: expect.any(Array),
      isActive:true
    }]))
  })
});

describe(`GET  ${path}/getOutletById`, function () {
  let outletCreated;
  beforeEach(async () =>{
    outletCreated = await createTestOutlet();
  })

  afterEach(async ()=>{
    await removeTestOutlet(outletCreated._id);
  });

  it('should get outlet with specific id', async () => {
    const result = await supertest(web)
      .get(path + `/getOutletById/${outletCreated._id}`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success get outlet with id "+outletCreated._id);
    expect(result.body.data).toEqual({
      _id: expect.any(String),
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
      images: expect.any(Array),
      isActive:true
    })
  })
});

describe(`GET  ${path}/searchOutlet`, function () {
  let outletCreated;
  beforeEach(async () =>{
    outletCreated = await createTestOutlet();
  })

  afterEach(async ()=>{
    await removeTestOutlet(outletCreated._id);
  });

  it('should get outlets searched', async () => {
    const result = await supertest(web)
      .get(path + `/searchOutlet?search=ringroad`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success get outlet searched");
    expect(result.body.data).toEqual(expect.arrayContaining([{
      _id: expect.any(String),
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
      images: expect.any(Array),
      isActive:true,
      score:expect.any(Number)
    }]))
  })
});

describe(`PUT  ${path}/updateOutlet`, function () {
  let outletCreated;
  beforeEach(async () =>{
    outletCreated = await createTestOutlet();
  })

  afterEach(async ()=>{
    await removeTestOutlet(outletCreated._id);
  });

  it('should update outlet with specific id', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .put(path + `/updateOutlet?outletId=${outletCreated._id}`)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .send({
        name: "Ring road Medan",
        location: {
          alamat: "Jl. Ring road No. 125",
          kecamatan: "Medan Sunggal",
          kelurahan: "Tanjung Sari"
        },
        openingHours: {
          open: "08:00",
          close: "22:00"
        },
        isActive: false
      });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success Update Outlet with id "+outletCreated._id);
    expect(result.body.data).toEqual({
      _id: expect.any(String),
      name: "Ring road Medan",
      location: {
        alamat: "Jl. Ring road No. 125",
        kecamatan: "Medan Sunggal",
        kelurahan: "Tanjung Sari"
      },
      openingHours: {
        open: "08:00",
        close: "22:00"
      },
      isActive: false,
      images: expect.any(Array)
    })
  })
});

describe(`DELETE ${path}/deleteOutlet`, function () {
  let outletCreated;
  beforeEach(async () =>{
    outletCreated = await createTestOutlet();
  })

  it('should delete outlet with specific id', async () => {
    const login = await supertest(web)
      .post('/api/v1/login')
      .send({
        email: "piceso3624@dxirl.com",
        password: "K5gb#mpg"
      });

    const result = await supertest(web)
      .delete(path + `/deleteOutlet?outletId=${outletCreated._id}`)
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Success delete outlet with id "+outletCreated._id);
    expect(result.body.data).toBe(null);
  })
});