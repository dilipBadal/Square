const fs = require('fs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const Post = require('../models/posts');
const Users = require('../models/users');

// Load the client credentials from the JSON file
const credentials = require('../credentials.json');

// Create an OAuth2 client with the credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Create a new instance of the Google Drive API
const drive = google.drive({ version: 'v3', auth });

exports.uploadPost = async (req, res) => {
  const token = req.headers.authorization;
  const caption = req.body.caption;
  const dp = req.body.dp;
  var webViewLink;
  var fileId;
  let decodedToken = null, username = null, file=null;

  try {
    // Verify the token
    const secretKey = 'gamer33d@123';
    try{
      decodedToken = jwt.verify(token, secretKey);
      username = decodedToken.username;      
    }
    catch (err){
      return res.status(501).json({ message: 'Could not verify User' });
    }

    try{
      // Perform the upload operation
      file = req.file;

      // Upload the file to Google Drive
      const fileMetadata = {
        name: `${username}-${Date.now()}-${file.originalname}`, // Replace with the desired file name
        parents: ['1yAq7EnoCj3FXbAxTc9-IwgnsKaCoOofB'], // ID of the folder to upload the file to
      };
      

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };

      const driveResponse = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webContentLink', // Specify the fields to retrieve (in this case, file ID and web view link)
      });

      // Get the file ID and web view link from the response
      fileId = driveResponse.data.id;
      webViewLink = driveResponse.data.webContentLink;
    }
    catch(err){
      return res.status(500).json({message: "Error: " + err})
    }

    if(dp){
      const user = await Users.findOne({ username });
      if (user) {
        user.dp = webViewLink;
        await user.save();
        fs.unlinkSync(file.path);
        return res.status(200).json({message: "Upload Complete"});
       } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    else{
      const post = {
        caption: caption,
        likes: 0,
        comments: [],
        image: webViewLink,
        fileId: fileId,
      };
  
      var userPost = await Post.findOne({ username });
  
      try{
        if (userPost == null) {
          // Create a new document if none exists
          userPost = new Post({ username, posts: [post] });
        } else {
          // Append the post to the existing user's posts list
          userPost.posts.push(post);
       }
      }
      catch(err){
        return res.status(500).json({message: "Error: " + err})
      }
      
      // Save the updated user's posts
      await userPost.save();
  
      // Delete the temporary file
      fs.unlinkSync(file.path);
  
      return res.status(200).json({ message: 'Post uploaded successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
