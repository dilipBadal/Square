/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ImageComponent from '../../ImageComponent'
import { FaCheck } from 'react-icons/fa';
import { Button, Box, Text, Input } from '@chakra-ui/react';
import axios from 'axios';

const NewsSuggestions = ({token, currentUser, isDarkMode}) => {
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [isTrendingActive, setTrendingActive] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [followStates, setFollowStates] = useState();
  

  useEffect(() => {
    if(token){
      if (isTrendingActive) {
        // Fetch trending news using news API
        fetch(
          "Your api key here, without an api key from NEWS API, this section of the code will produce an error"
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if(data.status != "ok"){
              console.log("hey");
              return
            }

            const tempNewsData = []; // Create a copy of the current newsData state
            for (let i = 0; i < 5; i++) {
              const randomIndex = Math.floor(Math.random() * 100);
              const title = data.articles[randomIndex].title;
              const imageURL = data.articles[randomIndex].urlToImage;
              const content = data.articles[randomIndex].content;
              const readURL = data.articles[randomIndex].url;
              const newsItem = { id: i, title, imageURL, content, readURL };
              tempNewsData.push(newsItem);
            }
            setNewsData(tempNewsData);
          })
          .catch((error) => console.error(error));
      } else {
        // Fetch user suggestions
        fetchSuggestions();
      }
    }
  }, [isTrendingActive, token]);

  const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

  const fetchSuggestions = async () => {
    if(!token){
      return null
    }

    const response = await api.get('/api/socialSquare/fetchSuggestions', {params: {currentUser}});
    setFetchedSuggestions(response.data.data); 
  }

  const handleRequest = async (postUser, viewer) => {
    try{
      const response = await api.post('/api/socialSquare/handleSentRequest', {postUser, viewer});
      if(response.status == 200){
        fetchSuggestions();
        return response.data.requestRecieved;
      }
    }
    catch(er){
      console.log(er.response.data);
    }
  }

  return (
    <Box>
      <Box className="btn-group text-center w-100" role="group" aria-label="News and Suggestions">
        <button
          type="button"
          className={`btn btn-primary ${isTrendingActive ? 'active' : ''}`}
          onClick={() => setTrendingActive(true)}
        >
          Trending
        </button>
        <button
          type="button"
          className={`btn btn-primary ${!isTrendingActive ? 'active' : ''}`}
          onClick={() => setTrendingActive(false)}
        >
          Suggestions
        </button>
      </Box>

      {isTrendingActive ? (
          <Box 
          transition={"ease-in 0.1s"}
          border={!isDarkMode ? "" : "0"}
          borderRadius={!isDarkMode ? "" : "10"}
          className="show-News"  style={{color: '#888', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          {/* Render trending news */}
          {newsData.map((news) => (
            <Box key={news.id} 
            borderRadius={!isDarkMode ? "" : "10"}
            className="card my-3 bg-background text-color"
            border={!isDarkMode ? "" : "0"}
            transition={"ease-in 0.1s"}
            >
              <Box 
              transition={"ease-in 0.5s"}
              borderRadius={10}
              border={"0"}
              bg={!isDarkMode ? "" : "dark.accent"}
              className="card-body shadow">
                <Text transition={"ease-in 0.5s"} color={!isDarkMode ? "" : "dark.text"} className="card-title">{news.title}</Text>
                <img className="card-img-top mb-3" src={news.imageURL} alt="News" />
                <Text transition={"ease-in 0.5s"} color={!isDarkMode ? "" : "dark.text"} className="card-text">{news.content}</Text>
                <a href={news.readURL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Read More
                </a>
              </Box>
            </Box>
          ))}
        </Box>
      ) :
      fetchedSuggestions.length > 0 ?(
        <Box className="show-Suggestions text-center" style={{ color: '#888', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        {fetchedSuggestions.slice(0, 5).map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} currentUser={currentUser} handleRequest={handleRequest}/>
          ))}
        </Box>
      ) : <Box className='show-Suggestions text-center' style={{ color: '#888', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        Congrats You know everyone!!!
      </Box>
      }
    </Box>
  );
};


function SuggestionCard({suggestion, currentUser, handleRequest}){
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Box className="row my-3 bg-background rounded shadow mx-1">
              <Box className="col-sm-12 col-md-6 col-lg-4 w-100 py-2">
                <Box className="card bg-light h-100">
                  <Box className="card-body d-flex align-items-center">
                    <Box className={isLoading ? 'loading-dp': 'me-3'}>
                      <ImageComponent imgSrc={suggestion.dp} width={"50px"} isDp={true} handleLoading={() => setIsLoading(false)}/>
                    </Box>
                    <Box className='mt-2'>
                      <h5 className="card-title mb-0">{suggestion.username}</h5>
                      <p className="card-text text-muted">{suggestion.bio}</p>
                      <button
                        className={`btn ${(suggestion.requestReceived.includes(currentUser)) ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleRequest(suggestion.username, currentUser)}
                      >
                        {(suggestion.requestReceived.includes(currentUser)) ? <FaCheck className="me-1" /> : null}
                        {(suggestion.requestReceived.includes(currentUser)) ? 'Sent' : 'Follow'}
                      </button>
                    </Box>
                  </Box>
                </Box>
              </Box>
  </Box>
  );
}

export default NewsSuggestions;
