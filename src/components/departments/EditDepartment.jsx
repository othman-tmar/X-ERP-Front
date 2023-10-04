import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { updateDepartment } from "../../features/DepartmentSlice"
import { useDispatch } from "react-redux";
import { UploadFirebase } from '../../utils/UploadFirebase';
import { Line } from 'rc-progress';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const EditEmployee = ({ department, show, handleClose }) => {
   

    
  const [uploadProgress, setUploadProgress] = useState(0);

    const [file, setFile] = useState("");

    
    const [nameDepartment, setNameDepartment] = useState();
    const [responsible, setResponsible] = useState();
    const [nbMachine, setNbMachine] = useState();
    const [cost, setCost] = useState();
    const [imageDepartment, setImageDepartment] = useState();
  
    


    const [validated, setValidated] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        setNameDepartment(department.nameDepartment);
        setResponsible(department.responsible);
        setNbMachine(department.nbMachine);
        setCost(department.cost);
        setImageDepartment(department.imageDepartment)
        setFile([
            {
                source: department.imageDepartment,
                options: { type: "local" }
            }
        ]);
        

    }, [department])

    

    const handleSubmit = (url) => {
      const dep = {
        ...department,
        nameDepartment: nameDepartment,
        responsible: responsible,
        nbMachine: nbMachine,
        imageDepartment: url,
        cost: cost
    }
    
        dispatch(updateDepartment(dep))
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
                const url = imageDepartment;
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
                        <h2 className='text-dark text-center'>Edit Department</h2>
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
                                            <Form.Label>
                                                Cost<span className="req-tag">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                value={cost}
                                                onChange={(e) => setCost(e.target.value)}
                                                placeholder="Cost"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                cost invalid
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Image Department</Form.Label>
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