import UsersService from "../../services/usersService";
import UsersRepo from "../../models/User"
import connect, { MongoHelper } from "../dbHelper";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createUserWithToken } from "../__fixtures__/createUserWithToken";

describe("User services", () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  beforeEach(async ()=> {
    await createAdminWithToken();
    await createUserWithToken();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  test("getAllUsers - admin only", async ()=> {
    const users = await UsersService.getAllUsers();
    expect(users.length).toBe(2);
  });

  test("getUserById - should find user by id", async () => {
    const users = await UsersService.getAllUsers();

    const user = await UsersService.getUserById(users[0]._id.toString());
    expect(user?.name).toBe("Test Admin");
  });

  test("createUser - on signup, should create a new user", async () => {

    const newUser = await UsersService.createUser({
      id:"112",
      name: "user",
      email:"user@email.com",
      password:"122345",
      avatar:"https://api.lorem.space/image/face?w=640&h=480&r=867",
      role:"CUSTOMER"
    });
    expect(newUser).toHaveProperty("_id");
    expect(newUser.name).toEqual("user");
  });

  test("getToken - should return token", async () => {
    const testToken = await UsersService.getToken({
      id:"112",
      name: "user",
      email:"user@email.com",
      avatar:"https://api.lorem.space/image/face?w=640&h=480&r=867",
      role:"CUSTOMER"
    })

     expect(testToken).not.toBe(null);
  });

  test('updateUser - Should update user', async () => {
    const users = await UsersService.getAllUsers();

    const updates = {
        name: "UPDATED NAME"
    }
    const id = users[0]._id.toString()
    const updatedUser = await UsersService.updateUser(id, updates);
    expect(updatedUser?.name).toBe("UPDATED NAME");
  });

  test('deleteUser - should delete user by id', async () => {
    const users = await UsersService.getAllUsers();

    const id = users[1]._id.toString()
    await UsersService.deleteUser(id);
    const deleted = await UsersRepo.findById(id);
    const usersAfterDeleting = await UsersService.getAllUsers();
    
    expect(deleted).toBe(null);
    expect(usersAfterDeleting.length).toBe(1);
  })
});