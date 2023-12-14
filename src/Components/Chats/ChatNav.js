import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


export const ChatNav = () => {

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <Navbar bg="primary" variant="primary" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">
          <i>WeConnect</i>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/all-chats">
              <Button variant="outline-light">Home</Button>
            </Nav.Link>
            
            <Nav.Link onClick={handleLogout}>
              <Button variant="outline-light">Logout</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

