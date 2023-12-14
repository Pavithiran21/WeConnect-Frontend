/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Image from 'react-bootstrap/esm/Image';
import Row from 'react-bootstrap/esm/Row';
import { API } from '../Utils/ApiRoute';
import { toast } from 'react-toastify';
import Card from 'react-bootstrap/Card';
import { ChatNav } from './ChatNav';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash} from '@fortawesome/free-solid-svg-icons';

const socket = io(API);

export const Conversation = () => {
  const [selectedChat, setSelectedChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { chatId } = useParams();
  const chatBodyRef = useRef();
  const navigate = useNavigate();

  const mychat = async () => {
    try {
      const response = await axios.get(`${API}/api/message/all-message/${chatId}`, {
        headers: {
          Authorization: window.localStorage.getItem('token'),
        },
      });

      if (response.data.status) {
        console.log(response.data.data)
        setSelectedChat(response.data.data);
        toast.success('Previous Messages Retrieved Successfully!');
      } else {
        toast.error('Failed to Retrieve Previous Messages. Please check it.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please check it!');
    }
  };

  useEffect(() => {
    mychat(chatId);

    socket.connect();

    socket.on('getMessage', (message) => {
      setSelectedChat((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [selectedChat]);

  const currentUser = {
    username: localStorage.getItem('username'),
  };


  const handleDeleteChat = async (id) => {
    try {
      const response = await axios.delete(`${API}/api/chat/delete-chat/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem('token'),
        },
      });
      if (response.data.status) {
        toast.success(response.data.message);
        navigate('/all-chats')
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please check your network connection.');
    }
  };
  

  const handleSendMessage = async () => {
    
    if (!newMessage || /^\s*$/.test(newMessage)) {
      toast.warning('Please enter a non-empty message.');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API}/api/message/send-message`,
        {
          chatId,
          message: newMessage,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem('token'),
          },
        }
      );
  
      if (response.data.status) {
        socket.emit('sendMessage', response.data.data);
  
        setSelectedChat((prevMessages) => [...prevMessages, response.data.data]);
  
        setNewMessage('');
        toast.success('Message sent successfully!');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please check your network connection.');
    }
  };
  
  
  return (
    <>
      <ChatNav />
      <Container fluid className='p-3'>
      <h1 className='text-center'>Conversation</h1>
        {selectedChat && selectedChat.length > 0 && (
          <>
            
            <Card className='conversation-card'>
              <Card.Header>
                <Row>
                  <Col>
                      <h1>
                    {
                    selectedChat[0].chatId.users[1].username === localStorage.getItem('username')
                      ? selectedChat[0].chatId.users[0].username 
                      : selectedChat[0].chatId.users[1].username
                    }
                    </h1>
                  </Col>
                  <Col className='d-flex justify-content-end align-items-center'>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className='text-danger'
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteChat(selectedChat[0].chatId._id)}

                     />
                  </Col>
                  
                </Row>
                
                
                
               
              </Card.Header>
              <Card.Body className='card-body' ref={chatBodyRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedChat
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((message, index, array) => (
                    <div key={message._id}>
                      {index === 0 || new Date(message.createdAt).toDateString() !== new Date(array[index - 1].createdAt).toDateString() ? (
                        <Row>
                          <Col>
                            <h5 className="text-center">{new Date(message.createdAt).toDateString()}</h5>
                          </Col>
                        </Row>
                      ) : null}
                      <Row>
                        <Col>
                          <div className={`d-flex flex-row ${message.sender.username === currentUser.username ? 'justify-content-end' : 'justify-content-start'}`}>
                            <Image src={message.sender.pic} className='image-view' roundedCircle />
                            <div>
                              <p style={{ margin: '0' }}>
                                <b style={{ color: message.sender.username === currentUser.username ? 'red' : 'green' }}>{message.sender.username === currentUser.username ? 'me' : message.sender.username}</b>
                              </p>
                              <p>{message.messages}</p>
                              <p style={{ fontSize: '0.8em', color: 'gray' }}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                }
              </Card.Body>
            </Card>
          </>
        )}
  
        <Row className=''>
          <Col className='m-3'>
            <Form>
              <Row>
                <Col sm={12} md={10} lg={10} className='m-1'>
                  <Form.Control
                    type='text'
                    placeholder='Enter a Message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </Col>
                <Col className='m-1'>
                  <Button variant='primary' onClick={handleSendMessage}>
                    Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
  
};


