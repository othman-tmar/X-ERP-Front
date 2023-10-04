import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../features/EmployeeSlice"
import { getEmployees } from '../../features/EmployeeSlice';


import { Line, Circle } from 'rc-progress';

import { UploadFirebase } from '../../utils/UploadFirebase';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const CreateEmployee = () => {

    const [uploadProgress, setUploadProgress] = useState(0);

    const [file, setFile] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    
    const dispatch = useDispatch();

    const {  isLoading } = useSelector((state) => state.storeEmployees);
   
    useEffect(() => {
        dispatch(getEmployees());
    }, [dispatch]);
    
    const handleSubmit = (url) => {
        const Employee = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            avatar: url,
            password: password,
            role: role
        }
        dispatch(createEmployee(Employee))
            .then(res => {
                console.log("Insert OK", res);
                setFirstname("");
                setLastname("");
                setEmail("");
                setPhone("");
                setAvatar("");
                setPassword("");
                setRole("");
                setValidated(false);
                setFile("")

                setUploadProgress(0)

                handleClose()
            })
            .catch(error => {
                console.log(error)
                alert("Error of insertion")
            })
    }

    const handleUpload = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            if (file) {
                if (!file[0].file) {
                    alert("Please upload an image first!");
                }
                else {
                    console.log(file[0].file)
                    resultHandleUpload(file[0].file, event);
                }
            } else {
                alert("Please upload an image first!");
            }
            setValidated(true);
        };
    }
    const resultHandleUpload = async (file) => {
        try {
const url = await UploadFirebase(file, setUploadProgress);
            handleSubmit(url)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Button

                onClick={handleShow}
                variant="success"
                size="sm"
                style={{ 'margin': 10, 'left': 10, fontFamily: 'Arial' }}
            >
                <i className="fa-solid fa-circle-plus"></i>
                &nbsp;
                Create new Employee
            </Button>
            <Modal show={show} onHide={handleClose} className='text-dark'>
                <Form noValidate validated={validated} onSubmit={handleUpload}>
                    <Modal.Header closeButton>
                        <Modal.Title> <h1 className='text-dark text-center' align="center">Employee Form</h1></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container w-100 d-flex justify-content-center">
                            <div>
                                <div className='form mt-3'>
                                    <Row className="mb-2">
                                        <Form.Group as={Col} md="6" >
                                            <Form.Label >First name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="first name"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Insert First name
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="last name"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                            Insert Last name
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-2">
                                        <Form.Group className="col-md-6">
                                            <Form.Label>E-mail</Form.Label>
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    type="email"
                                                    required
                                                    placeholder="email@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    email Incorrecte
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Phone</Form.Label>

                                            

                                            <Form.Control
                                                type="number"
                                                placeholder="Phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group className="col-md-6 ">
                                            <Form.Label>
                                                Password<span className="req-tag">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                paswword invalid
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Image</Form.Label>
                                            <FilePond

                                                files={file}
                                                allowMultiple={false}
                                                onupdatefiles={setFile}
                                                labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="12">
                                            <Form.Label ><h6 className="text-dark">Role</h6></Form.Label>
                                            <Form.Control
                                                as="select"
                                                type="select"
                                                id='select-role'
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                onClick={() => {
                                                    document.getElementById("select-role").options[0].style.display = 'none';
                                                  }}
                                            >
                                                <option className='text-center'>Select Role</option>
                                                <option>Admin</option>
                                                <option>Manager</option>
                                                <option>User</option>
                                                
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>

                                    

                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Line percent={uploadProgress} strokeWidth={3} strokeColor="#ff0000" />
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
export default CreateEmployee