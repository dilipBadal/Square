# Square
Square is a interactive and customizable social media site which offers a lot of modern day features uploading images and videos, likes, comments and sharing posts along with a brand new feature chatting with other users.


Hi there, Dilip here. You must be wondering how in the world do I run this project. Here to help. 

First and formost. Install the required libraries and technologies,
**For back-end,**
1. Node js ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
2. React ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
3. cors
4. http
5. Express js ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
6. mongoose
7. jwtwebtoekn
8. googleapis
9. nodemailer
10. bycrypt
11. mongodb ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

**For front-end**
1. bootstrap
2. chakra ui react
3. react-toastify
4. react-icons
5. axios
6. socket.io-client

Thats all for now.


**Database setup**

So next, 
go ahead and create a database with the name SocialSquare. If you want to name it something else then change the database name in the server.js file.

**Drive api**

The most important api to have is this, drive api.
How do you get it?
easy, go to google developers console. https://console.cloud.google.com/apis/dashboard this site. Then create a project. You can name it anything it doesn't matter. once that is done.
search for **drive api** and click enable.

1. Once enabled, click on manage button
2. Go to credentials
3. You will see OAuth 2.0 with a downlaod button at the right, download that file which should replace the file in ./back-end/credentials.json
4. You are not done yet.  Below you will see somehting called as service account.
5. Click on create service account or manage service account if you don't see create.
6. Follow what it shows and create an service account.
7. Once the account is created, click on the 3 dots and click on manage service accounts and then go to keys and create a key.
8. You are all set up for drive api

**E-mail Verification System**

1. You can use your personal email but I recommend you create a new one for the project.
2. Once you are ready with the email, go to security
3. Then go to two factor authentication
4. Enable it by verfying your phone
5. Then you will see app password or pass keys something like that
6. Create an app password
7. The final step is to update it in sendOTP.js file line 8 and 9.
8. The file can be found in the following path, ./back-end/controllers/sendOTP.js

**NEWS API**

This one is easy to setup
1. Go to news api website, https://newsapi.org/
2. Create an account
3. Get the key, which is free no need to pay for the premium one


Thats all for now, you should be all set to run the project now. Hit me up if you encounter any bugs!!!
