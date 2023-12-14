import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

import { API } from '../Utils/ApiRoute';
import { toast } from 'react-toastify';


export const Signup = () => {
  const validate = yup.object({
    username: yup.string().min(4, 'Must be 4 characters or above').required('Firstname is required'),   
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password must match')
      .required('Confirm password is required'),
  });

  const navigate = useNavigate();

  const SubmitHandler = async (data) => {
    try {
      // Replace the empty string with your API endpoint to send the form data
      const response = await axios.post(`${API}/api/users/signup`, data);
      
      if(response.data.status){
        toast.success("User registered successfully. Please click to login!!!");
        console.log(response.data);
        navigate("/");

      }else {
         toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.Please check it")
    }
  };

 

  return (

    <>
    
      <Container fluid className="main-form d-flex align-items-center justify-content-center">
      <Row>
        <Col>
         <h1 className='text-white text-center'>WeConnect</h1>
          <div className="bg-white form-wrapper ">
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validate}
              onSubmit={(values) => {
                console.log(values);
                let data = {
                 username:values.username,
                  
                  email: values.email,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                };
                SubmitHandler(data)
              }}
            >
              {({ errors, touched }) => (
                <Form className="signup-form" >
                  <h2 className="text-center">SIGN UP</h2>
                  
                      <div className="form-group">
                        <label>Username</label>
                        <Field
                          name="username"
                          className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                          type="text"
                          placeholder="Enter the Username"
                          required
                        />
                        {errors.username && touched.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                    

                  

                  <div className="form-group">
                    <label>Email</label>
                    <Field
                      name="email"
                      type="email"
                      className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      placeholder="Enter the Email"
                      required
                    />
                    {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <Field
                      name="password"
                      type="password"
                      className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      placeholder="Enter the Password"
                      required
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className={`form-control ${
                        errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                      }`}
                      placeholder="Enter the Confirm Password"
                      required
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div className="text-center">
                   
                    <Button variant="primary" type='submit' className='m-2'>Submit</Button>
                    <Button variant='danger' type='reset' className=''>Reset</Button>
                  </div>

                  <p className="text-center">
                    Already Registered? <a href="/" className="success" style={{textDecoration:"none"}} >Click here to Login</a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>



    </>
   
  );
};

