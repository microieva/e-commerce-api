import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    //required: true,
    default: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
  }
});

export default mongoose.model("Category", CategorySchema, "categories");
