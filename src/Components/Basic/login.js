import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik,Field,Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { API } from '../Utils/ApiRoute';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/esm/Button';


export const Login = () => {

  const validate =yup.object({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 charaters").required("Password is required"), 
  });
  const navigate = useNavigate();

  const SubmitHandler = async(data) =>{
    try {
      // Replace the empty string with your API endpoint to send the form data
      const response = await axios.post(`${API}/api/users/login`, data);
       window.localStorage.setItem('token', response.data.user_token);
        window.localStorage.setItem('username',response.data.data.username);
      
      if(response.data.status){
        toast.success(response.data.message);
        console.log(response.data);
        navigate("/all-chats");

      }else {
         toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.Please check it")
    }
  }






  return (
    <>
      <Container fluid className='main-form d-flex align-items-center justify-content-center'>
        <Row>
          
          <Col>
            <h1 className='text-white text-center'>WeConnect</h1>
            <div className='bg-white form-wrapper'>
         
              <Formik 
                initialValues={{ email:'', password:''}}
                validationSchema = {validate}
                onSubmit = {values =>{
                console.log(values);
                let data = {
                  
                  email:values.email,
                  password:values.password,
                };
                SubmitHandler(data);
                }}
              >
              {({ errors, touched  }) => (
                <Form className="signup-form">
                <h2 className="text-center">SIGN IN</h2>

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

                <div style={{textAlign:"right"}}>
                    <p><a href="/reset" className='error'style={{textDecoration:"none"}}>Forgot Password? </a></p>
                  </div>

                <div className="text-center">
                  
                  <Button variant="primary" type='submit' className='m-2'>Submit</Button>
                  <Button variant='warning' type='reset' className=''>Reset</Button>
                  
                </div>

                <p className="text-center">
                  Not Registered? <a href="/signup" className="success" style={{textDecoration:"none"}}>Click here to Sign Up</a>
                </p>
              </Form>
              )}
              

              
              </Formik>

            </div>
          </Col>
        </Row>

      </Container>
    </>

    





  )
}
