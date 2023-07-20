const { google } = require('googleapis');
// Load the client credentials from the JSON file
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

// Controller function for handling the image request
exports.getImage = async (req, res) => {
  try {
    const downloadLink = req.query.imageUrl; // Assuming you pass the download link as a query parameter

    // Extract the image ID from the download link
    const imageId = getImageId(downloadLink);

    if (!imageId) {
      return res.status(400).json({ message: 'Invalid download link' });
    }

    try{
        // Fetch the image data from Google Drive
        const response = await drive.files.get({ fileId: imageId, alt: 'media' }, { responseType: 'arraybuffer' });
        // Set the appropriate content type for the response
        res.set('Content-Type', response.headers['content-type']);
        const buffer = Buffer.from(response.data);
        // Stream the image data to the response
        // Write the image data to the response
        res.write(buffer);
        res.status(200);
        res.end();
        return res
    }
    catch(er){
        return res.status(500).json({message: er.response.data})
    }
  } catch (error) {
    return res.status(500).json({ message: "Error is here: " + error });
  }
};