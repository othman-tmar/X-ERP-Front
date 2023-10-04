import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { createMachine } from "../../features/MachineSlice";
import { getMachines } from "../../features/MachineSlice";
import { getDepartments } from "../../features/DepartmentSlice";

import { Line } from "rc-progress";

import { UploadFirebase } from "../../utils/UploadFirebase";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const CreateMachine = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const [file, setFile] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const [image, setImage] = useState("");
  const [referenceMachine, setReferenceMachine] = useState("");
  const [nameMachine, setNameMachine] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [productionTime, setProductionTime] = useState("");
  const [nbPreMainInWeek, setNbPreMainInWeek] = useState("");
  const [preventiveActions, setPreventiveActions] = useState([""]);
  const dispatch = useDispatch();

  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );

  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const handleActionChange = (index, event) => {
    const newActions = [...preventiveActions];
    newActions[index] = event.target.value;
    setPreventiveActions(newActions);
  };

  const handleAddAction = () => {
    setPreventiveActions([...preventiveActions, ""]);
  };
  const handleDeleteAction = (index) => {
    const newActions = [...preventiveActions];
    newActions.splice(index, 1);
    setPreventiveActions(newActions);
  };

  const handleSubmit = (url) => {
    const Machine = {
      referenceMachine: referenceMachine,
      nameMachine: nameMachine,
      departmentID: departmentID,
      productionTime: productionTime,
      image: url,
      nbPreMainInWeek: nbPreMainInWeek,
      preventiveActions: preventiveActions,
    };
    dispatch(createMachine(Machine))
      .then((res) => {
        console.log("Insert OK", res);
        setImage("");
        setReferenceMachine("");
        setNameMachine("");
        setDepartmentID("");
        setProductionTime("");
        setNbPreMainInWeek("");
        setPreventiveActions([]);
        setValidated(false);
        setFile("");

        setUploadProgress(0);

        handleClose();
      })
      .catch((error) => {
        console.log(error);
        alert("Error of insertion");
      });
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      if (file) {
        if (!file[0].file) {
          alert("Please upload an image first!");
        } else {
          console.log(file[0].file);
          resultHandleUpload(file[0].file, event);
        }
      } else {
        alert("Please upload an image first!");
      }
      setValidated(true);
    }
  };
  const resultHandleUpload = async (file) => {
    try {
      const url = await UploadFirebase(file, setUploadProgress);
      handleSubmit(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        onClick={handleShow}
        variant="success"
        size="sm"
        style={{ margin: 10, left: 10, fontFamily: "Arial" }}
      >
        <i className="fa-solid fa-circle-plus"></i>
        &nbsp; Create new Machine
      </Button>
      <Modal show={show} onHide={handleClose} className="text-dark">
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <h1 className="text-dark text-center" align="center">
                Machine Form
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container w-100 d-flex justify-content-center">
              <div>
                <div className="form mt-3">
                  <Row className="mb-2">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Reference Machine</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="reference machine"
                        value={referenceMachine}
                        onChange={(e) => setReferenceMachine(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Insert Reference machine
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Name Machine</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="name machine"
                        value={nameMachine}
                        onChange={(e) => setNameMachine(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Insert Name machine
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group className="col-md-6">
                      <Form.Label>Production Time /Day</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="number"
                          required
                          placeholder="production time /day"
                          value={productionTime}
                          onChange={(e) => setProductionTime(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Insert Production time
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>NB Pre Main /Week</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="Nb preventive maintenance /week"
                        value={nbPreMainInWeek}
                        onChange={(e) => setNbPreMainInWeek(e.target.value)}
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
                        labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Form.Label>
                        <h6 className="text-dark">Department</h6>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        type="select"
                        id="select-department"
                        value={departmentID}
                        onChange={(e) => setDepartmentID(e.target.value)}
                        onClick={() => {
                          document.getElementById(
                            "select-department"
                          ).options[0].style.display = "none";
                        }}
                      >
                        <option className="text-center">
                          Select Department
                        </option>
                        {!isLoading
                          ? departments.map((dep) => (
                              <option key={dep._id} value={dep._id}>
                                {dep.nameDepartment}
                              </option>
                            ))
                          : null}
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Label style={{ fontSize: "15px" }}>
                      Preventive Actions
                    </Form.Label>
                    {preventiveActions.map((action, index) => (
                      <Form.Group as={Row} key={index}>
                        <Col md="10">
                          <Form.Label style={{ fontSize: "10px" }}>
                            Preventive Action {index + 1}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={action}
                            onChange={(event) =>
                              handleActionChange(index, event)
                            }
                            
                          />
                        </Col>
                        <Col
                          md="2"
                          className="d-flex align-items-center justify-content-center"
                        >
                          <Button
                            variant="danger"
                            type="button"
                            style={{ marginTop: "25px" }}
                            onClick={() => handleDeleteAction(index)}
                          >
                            x
                          </Button>
                        </Col>
                      </Form.Group>
                    ))}
                    <Button
                      type="button"
                      style={{ margin: "6px" }}
                      onClick={handleAddAction}
                    >
                      +
                    </Button>
                  </Row>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Line
              percent={uploadProgress}
              strokeWidth={3}
              strokeColor="#ff0000"
            />
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default CreateMachine;
