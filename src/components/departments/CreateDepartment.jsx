import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from "react-redux";
import { createDepartment } from "../../features/DepartmentSlice"
import { getDepartments } from '../../features/DepartmentSlice';


import { Line, Circle } from 'rc-progress';

import { UploadFirebase } from '../../utils/UploadFirebase';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const CreateDepartment = () => {

    const [uploadProgress, setUploadProgress] = useState(0);

    const [file, setFile] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);

    const [nameDepartment, setNameDepartment] = useState("");
    const [responsible, setResponsible] = useState("");
    const [nbMachine, setNbMachine] = useState("");
    /* const [cost, setCost] = useState(""); */
    const [imageDepartment, setImageDepartment] = useState("");
   
    

    const dispatch = useDispatch();

    const {  isLoading } = useSelector((state) => state.storeDepartments);
   
    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    const handleSubmit = (url) => {
        const Department = {
            nameDepartment: nameDepartment,
            responsible: responsible,
            nbMachine: nbMachine,
            imageDepartment: url,
            /* cost: cost */
            
        }
        dispatch(createDepartment(Department))
            .then(res => {
                console.log("Insert OK", res);
                setNameDepartment("");
                setResponsible("");
                setNbMachine("");
                setImageDepartment("");
                /* setCost(""); */
                setValidated(false);
                setFile("")

                setUploadProgress(0)

                handleClose()
            })
            .catch(error => {
                console.log(error)
                alert("Error of adding")
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
                Create new department
            </Button>
            <Modal show={show} onHide={handleClose} className='text-dark'>
                <Form noValidate validated={validated} onSubmit={handleUpload}>
                    <Modal.Header closeButton>
                        <Modal.Title> <h1 className='text-dark text-center' align="center">Department Form</h1></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container w-100 d-flex justify-content-center">
                            <div>
                                <div className='form mt-3'>
                                    <Row className="mb-2">
                                        <Form.Group as={Col} md="6" >
                                            <Form.Label >Department name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="department name"
                                                value={nameDepartment}
                                                onChange={(e) => setNameDepartment(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Insert department name
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Responsible name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="responsible"
                                                value={responsible}
                                                onChange={(e) => setResponsible(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                            Insert responsible
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-2">
                                        
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Number of machines</Form.Label>

                                            

                                            <Form.Control
                                                type="number"
                                                placeholder="number of machines"
                                                value={nbMachine}
                                                onChange={(e) => setNbMachine(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group className="col-md-6 ">
                                           {/*  <Form.Label>
                                                Cost<span className="req-tag">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                
                                                type="number"
                                                value={cost}
                                                onChange={(e) => setCost(e.target.value)}
                                                placeholder="Cost"
                                            /> */}
                                            <Form.Control.Feedback type="invalid">
                                                cost invalid
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group /* as={Col} md="6" */>
                                            <Form.Label>Image Department</Form.Label>
                                            <FilePond

                                                files={file}
                                                allowMultiple={false}
                                                onupdatefiles={setFile}
                                                labelIdle='<span className="filepond--label-action">Browse One</span>'
                                            />
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
export default CreateDepartment