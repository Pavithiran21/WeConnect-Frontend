import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik,Field,Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { API } from '../Utils/ApiRoute';

export const Forgot = () => {

  const validate =  yup.object({
    email: yup.string().email("Email is invalid").required("Email is required"),
  });

  const Navigate = useNavigate();  
  const SubmitHandler = async (data) => {
    try {
      let response = await axios.post(`${API}/api/users/reset`, data);
       console.log(response);
      if (response.data.status) {
        toast.success('Password Reset Link sent successfully. Please check the mail to reset the password');
        console.log(response.data.data);
        Navigate('/');
      } else if(!response.data.status) {
        // Show error message from the 'error' object
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please check it.....');
    }
  };




  return (
    <Container fluid className='main-form d-flex align-items-center justify-content-center'>
      <Row >
      
        <Col>
        <h1 className='text-white text-center'>WeConnect</h1>
        <div className='bg-white form-wrapper'>
       
          <Formik 
            initialValues={{ email:''}}
            validationSchema = {validate}
            onSubmit = {values =>{
            console.log(values);
            let data = {
              email:values.email
              
            };
            SubmitHandler(data);
            }}
          >
           {({ errors, touched  }) => (
            <Form className="signup-form">
            <h2 className="text-center">FORGOT PASSWORD</h2>
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
            <div className='text-center'>
              <Button variant="danger" type="submit" className='m-2'>
                Send Mail
              </Button>

            </div>
            
          </Form>
           )}
          

          
          </Formik>

        </div>
        </Col>
      </Row>
    </Container>
  )
}
