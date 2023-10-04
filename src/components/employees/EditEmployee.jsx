import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { updateEmployee } from "../../features/EmployeeSlice"
import { useDispatch, useSelector } from "react-redux";
import { UploadFirebase } from '../../utils/UploadFirebase';
import { Line } from 'rc-progress';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const EditEmployee = ({ employee, show, handleClose }) => {
   
  const [uploadProgress, setUploadProgress] = useState(0);

    const [file, setFile] = useState("");

    
     const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [avatar, setAvatar] = useState();
  /*   const [password, setPassword] = useState(); */
    const [role, setRole] = useState();


    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        setFirstname(employee.firstname);
        setLastname(employee.lastname);
        setEmail(employee.email);
        setPhone(employee.phone);
        setAvatar(employee.avatar)
        setFile([
            {
                source: employee.avatar,
                options: { type: "local" }
            }
        ]);
        setRole(employee.role);

    }, [employee])

    

    const handleSubmit = (url) => {
      const empl = {
        ...employee,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        avatar: url,
        role: role
    }
    
        dispatch(updateEmployee(empl))
            .then(res => {
                setUploadProgress(0)

            })
            .catch(error => {
                console.log(error)
                alert("Error !")
            })
    }
    
    const handleUpload = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            if (!file) {
                const url = avatar;
                handleClose()
                handleSubmit(url)
            }
            else {
                resultHandleUpload(file[0].file, event);
            }
            setValidated(true);
        };
    }
    const resultHandleUpload = async (file) => {
        try {
            const url = await UploadFirebase(file, setUploadProgress);
            handleClose()
            handleSubmit(url)
        } catch (error) {
        }
    }
    return (
        <div>

            <Modal className='text-dark' show={show} onHide={handleClose} >
                <Form noValidate validated={validated} onSubmit={handleUpload}>
                    <Modal.Header closeButton>
                        <h2 className='text-dark text-center'>Edit Employee</h2>
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
                                        
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Image</Form.Label>
                                            <FilePond

                                                files={file}
                                                allowMultiple={false}
                                                onupdatefiles={setFile}
                                                labelIdle='<span className="filepond--label-action">Browse One</span>'

                                                server={{
                                                    load: (source, load, error, progress, abort, headers) => {
                                                        var myRequest = new Request(source);
                                                        fetch(myRequest).then(function (response) {
                                                            response.blob().then(function (myBlob) {
                                                                load(myBlob);
                                                            });
                                                        });
                                                    }
                                                }}
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
                        <Button type="submit">Submit</Button>
                        <Button type="button" className="btn btn-warning" onClick={handleClose}
                        >Cancel</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}
export default EditEmployee