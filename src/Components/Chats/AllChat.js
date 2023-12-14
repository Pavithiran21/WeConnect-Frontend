/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { API } from '../Utils/ApiRoute';
import { ChatNav } from './ChatNav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export const AllChat = () => {
  const [allChats, setAllChats] = useState([]);
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const mainChats = async () => {
    try {
      const response = await axios.get(`${API}/api/chat/all-chats`, {
        headers: {
          authorization: window.localStorage.getItem('token'),
        },
      });

      if (response.data.status) {
        setAllChats(response.data.data);
        toast.success('All Chats Shown Successfully');
      } else {
        toast.error('All Chats cannot be shown. Please check it');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please check it!');
    }
  };

  const handleSearch = async () => {
    try {
      if (!search.trim()) {
        setSearchResults([]);
        toast.error("Empty Search cannot be done. Please fix it");
        return;
      }

      const response = await axios.get(`${API}/api/users/search-user`, {
        headers: {
          authorization: window.localStorage.getItem('token'),
        },
        params: {
          search: search,
        },
      });

      if (response.data.status) {
        setSearchResults(response.data.data);
        toast.success(response.data.message);
      } else {
        setSearchResults([]);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setSearchResults([]);
      toast.error('Something went wrong during the search. Please try again!');
    }
  };

  const viewMessage = (chatId) => {
    navigate(`/all-message/${chatId}`);
  };

  const handleCardClick = async (userId) => {
    const selectedUserDetails = searchResults.find((user) => user._id === userId);

    if (selectedUserDetails) {
      setSelectedUser(selectedUserDetails);

      try {
        const response = await axios.post(
          `${API}/api/chat/chat-dashboard`,
          { userId: selectedUserDetails._id },
          {
            headers: {
              authorization: window.localStorage.getItem('token'),
            },
          }
        );

        if (response.data.status) {
          viewMessage(response.data.data._id);
          toast.success(response.data.message);
        } else {
          setSearchResults([]);
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        setSearchResults([]);
        toast.error('Something went wrong during the chat creation. Please try again!');
      }
    }
  };

  useEffect(() => {
    mainChats();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  

 

  return (
    <>
      <ChatNav />
      <Container fluid>
        <Row>
          <h1 className='text-center'>My Chats</h1>
        </Row>
        <Card className='m-5'>
          <Card.Body>
            <Row>
              <Col className='ms-auto'>
                <div className='d-flex flex-row m-1'>
                  <Image
                    src='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    className='image-view mt-2'
                    roundedCircle
                  />
                  <h1 className='m-1'>{username}</h1>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className='ms-auto m-3'>
                <Form>
                  <Row>
                    <Col sm={12} md={10} lg={10} className='m-1'>
                      <Form.Control
                        type='search'
                        placeholder='Search for a User'
                        aria-label='Search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Col>
                    <Col className='m-1'>
                      <Button variant='outline-danger' onClick={handleSearch}>
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>

            {searchResults.length > 0 && (
              <Row>
                <Col>
                  <h1>Search Results</h1>
                  {searchResults.map((result) => (
                    <Card key={result._id} onClick={() => handleCardClick(result._id)}>
                      <Card.Body>
                        <Row>
                          <Col>
                            <div className='d-flex flex-row'>
                              <Image 
                                src='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                                className='image-view mt-2'
                                roundedCircle
                               />
                              <div className='m-1'>
                                
                                  <b>{result.username}</b>
                                  <p>{result.email}</p>
                                
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <h1>Chats</h1>
              </Col>
            </Row>
            {Array.isArray(allChats) && allChats.length > 0 ? (
              allChats.map((chat, key) => (
                <Row key={key} className='m-3'>
                  <Card onClick={() => viewMessage(chat._id)}>
                    <Card.Body>
                      <Row>
                        <div className='d-flex flex-row'>
                          <Image src={chat.photo} roundedCircle className='image-view mt-2' />
                          <div className='m-1'>
                            <p style={{ margin: '0' }}>
                              <b>
                                {chat.users[0].username === localStorage.getItem('username')
                                  ? chat.users[1].username
                                  : chat.users[0].username}
                              </b>
                            </p>
                            <p>{chat.latestMessage[0].messages}</p>
                          </div>
                        </div>
                      </Row>
                    </Card.Body>
                  </Card>
                </Row>
              ))
            ) : (
              <Row>
                <Col className='text-center'>
                  <h1>No Chats Found</h1>
                </Col>
              </Row>
            )}

          </Card.Body>
        </Card>
      </Container>
    </>
  );
};







