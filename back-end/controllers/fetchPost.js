const User = require('../models/users');
const Post = require('../models/posts');


exports.fetchPost = async (req, res) => {
    try {
        const isIndividual = req.query.self;
        if(isIndividual){
          const user = await User.findOne({username: req.query.currentUser});
          const userPosts = await Post.find({ username: user.username });
          const processedPosts = userPosts.map((post) => {
            const processedData = [];
            post.posts.forEach((data) => {
              processedData.push({
                username: post.username,
                postId: data._id,
                caption: data.caption,
                likes: data.likes,
                comments: data.comments,
                image: data.image,
                dp: user.dp,
              });
            });
            return processedData;
          });
          return res.json([processedPosts]);
        } 

        // Get all users with public privacy
        const users = await User.find({ privacy: 'public' });
        const currentUser = await User.findOne({username: req.query.currentUser})
        const allFollowing = currentUser.following;
        const followingPosts = await Promise.all(
          allFollowing.map(async (username) =>{
            const user = await User.findOne({username: username});
            const userPosts = await Post.find({username: username});
            const processedPosts = userPosts.map((post) => {
              const processedData = [];
              post.posts.forEach(async (data) => {
                processedData.push({
                  username: post.username,
                  postId: data._id,
                  caption: data.caption,
                  likes: data.likes,
                  comments: data.comments,
                  image: data.image,
                  dp: user.dp,
                  uploadedAt: data.uploadedAt,
                });
              });
              return processedData;
            });
            return processedPosts;
          })
        );

        // Get posts for each user
        const posts = await Promise.all(
          users.map(async (user) => {
            const userPosts = await Post.find({ username: user.username });
            const processedPosts = userPosts.map((post) => {
              const processedData = [];
              post.posts.forEach((data) => {
                processedData.push({
                  username: post.username,
                  postId: data._id,
                  caption: data.caption,
                  likes: data.likes,
                  comments: data.comments,
                  image: data.image,
                  dp: user.dp,
                  uploadedAt: data.uploadedAt,
                });
              });
              return processedData;
            });
            return processedPosts;
          })
        );

        const flattenedPosts = posts.flat();

        flattenedPosts.push(followingPosts.flat().flat());

        let filteredArray = [];
        flattenedPosts.map((post) => {
          return post.map((p) => {
            if (filteredArray.length <= 0) {
              filteredArray.push(p);
            } else {
              let earliestTime = new Date(filteredArray[0].uploadedAt).getTime();
              let currentTime = new Date(p.uploadedAt).getTime();

              if (currentTime >= earliestTime) {
                filteredArray.unshift(p);
              } else {
                filteredArray.push(p);
              }
            }
          });
        });

        let tempArray = []
        const uniquePosts = filteredArray.flat().filter((post) => {
          if(!tempArray.includes(post.postId.toString())){
            tempArray.push(post.postId.toString());
            return true;
          }
          return false
        });

        res.json([[uniquePosts]]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }  
};
