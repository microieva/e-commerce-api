import request from "supertest";
import app from "../../";
import UserService from "../../services/usersService";
import UsersRepo from "../../models/User";
import connect, { MongoHelper } from "../dbHelper";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";

describe("User controllers", () => {
  let mongoHelper: MongoHelper | undefined; 

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    if (mongoHelper) {
      await mongoHelper.clearDatabase(); 
    }
  });

  afterAll(async () => {
    if (mongoHelper) {
      await mongoHelper.closeDatabase(); 
    }
  });

  test("getUsers - should return users array", async () => {
    const adminToken = await createAdminWithToken();

    const response = await request(app)
      .get("/api/v1/users")
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Test Admin");
  });

  test('createUser - should return a token when user signs up', async () => {
    const testUser = {
      name: "Test User",
      email:"user@email.com",
      password:"user123"
    }
    
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toBeTruthy();
  });

  test("getUserById - should find user by id", async () => {
    const testUser = {
      name: "Test User",
      email: "user@email.com",
      password: "user123"
    }
    const token = await createAdminWithToken();
    const user = new UsersRepo(testUser);
    const addedUser = await user.save();
    const userId = addedUser._id.toString();

    const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.name).toBe("Test User");
  });

  test('updateUser - should update exisiting user details', async () => {
    const testUser = {
      name: "Test User",
      email: "user@email.com",
      password: "user123"
    }
    const token = await createAdminWithToken();
    const user = new UsersRepo(testUser);
    const addedUser = await user.save();
    const userId = addedUser._id.toString();
    const userUpdates = {
      name: "UPDATED USER",
      password: "updated_password"
    }

    const response = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("UPDATED USER");
  });
  
  test('deleteUser - should delete existing user', async ()=> {
    const testUser = {
      name: "Test User",
      email: "user@email.com",
      password: "user123"
    }
    const token = await createAdminWithToken();
    const user = new UsersRepo(testUser);
    const addedUser = await user.save();
    const userId = addedUser._id.toString();

    const response = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ msg: "User was deleted successfuly"});
  })

  test('login - should login an existing user', async ()=> {
    const token = await createAdminWithToken();
    const loginRequest = {
      email: "admin@email.com",
      password: "admin123"
    }

    const response = await request(app)
      .post(`/api/v1/auth/login`)
      .send(loginRequest);
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(token);
  })
});
