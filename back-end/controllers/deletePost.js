const Post = require('../models/posts');
const { google } = require('googleapis');
const credentials = require('../credentials.json');

// Create an OAuth2 client with the credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Create a new instance of the Google Drive API
const drive = google.drive({ version: 'v3', auth });

// Extract the image ID from the download link
const getImageId = (downloadLink) => {
  const match = downloadLink.match(/id=(.+?)&export/);
return match ? match[1] : null;
};

exports.deletePost = async (req, res) => {
    const postUsername = req.body.postUsername;
    const postId = req.body.postId;
    const imageSrc = req.body.imageSrc;
  
    try {
      // Find the user by postUsername and update the posts array
      const user = await Post.findOneAndUpdate(
        { username: postUsername },
        { $pull: { posts: { _id: postId } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const imgId = getImageId(imageSrc);

      if(!imgId){
        return res.status(500).json({message: 'Error Deleting Post'});
      }

      try{
        await drive.files.delete({fileId: imgId});
        return res.status(200).json({message: "Post deleted successfully"});
      }
      catch(er){
        return res.status(500).json({message: 'Could not delete post'});
      }
  
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
};
  