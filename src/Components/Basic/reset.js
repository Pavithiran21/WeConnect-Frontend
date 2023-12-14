import React from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Formik,Form,Field} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { API } from '../Utils/ApiRoute';


export const Reset = () => {

  const validate =  yup.object({
    password: yup.string().min(6, "Password must be at least 6 charaters").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Password must match").required("Confirm password is required"),
  });

  const Navigate = useNavigate();
  const { resetToken } = useParams();

  const submitHandler = async (values) => {
    try {
      const response = await axios.put(`${API}/api/users/reset/${resetToken}`, values);
      console.log(response.data);
      

      if (response.data.status) {
        toast.success("Password reset successfully");
        Navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please check it.");
    }
  };




  return (
    <>
      <Container fluid className='main-form d-flex align-items-center justify-content-center'>
        <Row>
         
          <Col>
           <h1 className='text-white text-center'>WeConnect</h1>
            <div className='bg-white form-wrapper'>
         
              <Formik 
                initialValues={{ password:'', confirmPassword:''}}
                validationSchema = {validate}
                onSubmit = {values =>{
                console.log(values);
                let data = {
                  
                  password:values.password,
                  confirmPassword:values.confirmPassword
                };
                submitHandler(data);
                }}
              >
              {({ errors, touched  }) => (
                  <Form className="signup-form">
                  <h2 className="text-center">RESET PASSWORD</h2>

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
                <div className="text-center ">
                  <Button variant="primary" type='submit' className='m-2'>Submit</Button>
                  <Button variant='danger' type='reset' className=''>Reset</Button>
                </div>
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
