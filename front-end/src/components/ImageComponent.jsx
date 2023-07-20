/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import "./homepage/post/post.css";
import axios from 'axios';
import './image.css'


const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

const ImageComponent = ({ imgSrc, handleLoading, width, height, isDp}) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageData, setImageData] = useState('');
    const [mimeType, setMimeType] = useState();
    const [videoData, setVideoData] = useState();
    const [videoLoading, setVideoLoading] = useState();
  
    useEffect(() => {
      const fetchImage = async () => {
        try {
          const response = await api.get('/api/socialSquare/getImage', {
            params: { imageUrl: imgSrc },
            responseType: 'arraybuffer',
          });

          if(response.status == 200){
            const arrayBuffer = response.data; // Replace with the actual response data
            const arrayBufferView = new Uint8Array(arrayBuffer);
            let mimeType;

            // Check the Content-Type header to determine the MIME type
            const contentTypeHeader = response.headers['content-type'];
            if (contentTypeHeader.startsWith('image/')) {
              mimeType = contentTypeHeader;
              setMimeType(mimeType);
              const blob = new Blob([arrayBufferView], { type: mimeType });
              const urlCreator = window.URL || window.webkitURL;
              const imageUrl = urlCreator.createObjectURL(blob);
              setImageData(imageUrl);
              setImageLoading(false);
            } else if (contentTypeHeader.startsWith('video/')) {
              mimeType = contentTypeHeader;
              setMimeType(mimeType);
              const blob = new Blob([arrayBufferView], { type: mimeType });
              const urlCreator = window.URL || window.webkitURL;
              const videoUrl = urlCreator.createObjectURL(blob);
              setVideoData(videoUrl);
              setVideoLoading(false);
            }
          }
        } catch (error) {
          console.log(error.response.data);
        }
      };
  
      fetchImage();
    }, [imgSrc]);

    if(mimeType && mimeType.startsWith('image/')){
      return (
        <img 
          src={imageLoading ? '' : imageData}
          alt=""
          className={
            width ? (isDp ? "profile-picture img-fluid rounded-circle": "profile-picture img-fluid"): 
            (isDp ? "mx-0 my-0 img-fluid rounded-circle" : "mx-0 my-0 img-fluid")
          }
          onLoad={handleLoading}
          width={width}
          height={height}
          style={{maxHeight: "500px"}}
        />
      ); 
    }
    else if(mimeType && mimeType.startsWith('video/')){
      return(
        <video
      controls
      className={
        width ? (isDp ? "profile-picture img-fluid rounded-circle": "profile-picture img-fluid"): (isDp ? "mx-0 my-0 img-fluid rounded-circle" : "mx-0 my-0 img-fluid")
      }
      width={width}
      height={height}
      >
        <source src={videoLoading? '' :videoData} type={mimeType}></source>
      </video>
      )
    }
};


export default ImageComponent;