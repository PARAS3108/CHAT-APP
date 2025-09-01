import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id;
    const filterUsers = await User.find({ _id: { $ne: loggedUser } }).select(
      "-password"
    );

    res.status(200).json(filterUsers);
  } catch (error) {
    console.error("Error in getUserForSideBar", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, reciverId: userToChat },
        { senderId: userToChat, reciverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Got error in getAllMessages", error.message);
    res.status(500).json("internal server error");
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { id: reciverId } = req.params;

    let imageurl;
    if (image) {
      //upload the image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageurl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imageurl,
    });
    await newMessage.save();

    //todo realtime functionality goes here =>socket.io
    res.status(200).json(newMessage);
  } catch (err) {
    console.log("Got error in SendMessage", err.message);
    res.status(500).json("internal server error");
  }
};
