import mongoose from "mongoose";
import fs from "fs";
import User from "./models/user.js";
import Post from "./models/post.js";
import customEnv from 'custom-env';

customEnv.env(process.env.NODE_ENV, './config');

// set the path to the JSON files
const jsonFilePathUser = "./json-db/users.json";
const jsonFilePathPost = "./json-db/posts.json";

const importUsers = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.CONNECTION_STRING, {});
    await User.deleteMany({});

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePathUser, 'utf-8'));

    // Convert the ObjectId fields
    const convertedData = jsonData.map(user => {
      if (user.friends) {
        user.friends = user.friends.map(friend => {
          if (friend._id && friend._id['$oid']) {
            friend._id = new mongoose.Types.ObjectId(friend._id['$oid']);
          }
          if (friend.friendId && friend.friendId['$oid']) {
            friend.friendId = new mongoose.Types.ObjectId(friend.friendId['$oid']);
          }
          return friend;
        });
      }
      if (user._id && user._id['$oid']) {
        user._id = new mongoose.Types.ObjectId(user._id['$oid']);
      }
      return user;
    });

    await User.insertMany(convertedData);
    console.log('User data inserted successfully.');
  } catch (error) {
    console.error('Error inserting user data:', error);
  }
  finally {
    await mongoose.disconnect();
  }
};


const importPosts = async () => {
    try {
      // Connect to the database
      await mongoose.connect(process.env.CONNECTION_STRING, {});
      await Post.deleteMany({});
  
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePathPost, 'utf-8'));
      
      // Convert the ObjectId fields
      const convertedData = jsonData.map(post => {
        if (post._id && post._id['$oid']) {
          post._id = new mongoose.Types.ObjectId(post._id['$aoid']);
        }
        if (post.author && post.author['$oid']) {
          post.author = new mongoose.Types.ObjectId(post.author['$oid']);
        }
  
        // Convert date fields
        if (post.date && post.date['$date']) {
          post.date = new Date(post.date['$date']);
        }
  
        // Convert likes to ObjectId
        if (post.likes) {
          post.likes = post.likes.map(like => {
            if (like['$oid']) {
              return new mongoose.Types.ObjectId(like['$oid']);
            }
            return like;
          });
        }
  
        // Handle comments, including nested ObjectId and Date conversions
        if (post.comments) {
          post.comments = post.comments.map(comment => {
            if (comment._id && comment._id['$oid']) {
              comment._id = new mongoose.Types.ObjectId(comment._id['$oid']);
            }
            if (comment.author && comment.author['$oid']) {
              comment.author = new mongoose.Types.ObjectId(comment.author['$oid']);
            }
            if (comment.date && comment.date['$date']) {
              comment.date = new Date(comment.date['$date']);
            }
            return comment;
          });
        }
        return post;
      });
  
      await Post.insertMany(convertedData);
      console.log('Posts inserted successfully.');
    } catch (error) {
      console.error('Error inserting post data:', error);
    } finally {
      await mongoose.disconnect();
    }
  };
  

const runImports = async () => {
  await importUsers();
  await importPosts();
  
};

runImports().catch(console.error);

