import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { updateMachine } from "../../features/MachineSlice";
import { useDispatch, useSelector } from "react-redux";
import { UploadFirebase } from "../../utils/UploadFirebase";
import { Line } from "rc-progress";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { getDepartments } from "../../features/DepartmentSlice";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditMachine = ({ machine, show, handleClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );
  const [file, setFile] = useState("");

  const [image, setImage] = useState("");
  const [referenceMachine, setReferenceMachine] = useState("");
  const [nameMachine, setNameMachine] = useState("");
  const [departmentID, setDepartmentID] = useState(
    "departmentID.nameDepartment"
  );
  const [productionTime, setProductionTime] = useState("");
  const [nbPreMainInWeek, setNbPreMainInWeek] = useState("");
  const [preventiveActions, setPreventiveActions] = useState(machine.preventiveActions || []);

  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  

  useEffect(() => {
    setPreventiveActions(machine.preventiveActions || []);
  }, [machine.preventiveActions]);


  const handleActionChange = (index, event) => {
    const newActions = [...preventiveActions];
    newActions[index] = event.target.value;
    setPreventiveActions(newActions);
  };

  const handleDeleteAction = (index) => {
    const newActions = preventiveActions.filter((_, i) => i !== index);
    setPreventiveActions(newActions);
  };

  const handleAddAction = () => {
    setPreventiveActions([...preventiveActions, '']);
  };
  useEffect(() => {
    setImage(machine.image);
    setReferenceMachine(machine.referenceMachine);
    setNameMachine(machine.nameMachine);
    setDepartmentID(machine.departmentID);
    setProductionTime(machine.productionTime);
    setNbPreMainInWeek(machine.nbPreMainInWeek);
    
    
    setFile([
      {
        source: machine.image,
        options: { type: "local" },
      },
    ]);
  }, [machine]);

  const handleSubmit = (url) => {
    const mach = {
      ...machine,
      referenceMachine: referenceMachine,
      nameMachine: nameMachine,
      departmentID: departmentID,
      productionTime: productionTime,
      image: url,
      nbPreMainInWeek: nbPreMainInWeek,
      preventiveActions: preventiveActions,
    };

    dispatch(updateMachine(mach))
      .then((res) => {
        setUploadProgress(0);
      })
      .catch((error) => {
        console.log(error);
        alert("Error !");
      });
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      if (!file) {
        const url = image;
        handleClose();
        handleSubmit(url);
      } else {
        resultHandleUpload(file[0].file, event);
      }
      setValidated(true);
    }
  };
  const resultHandleUpload = async (file) => {
    try {
      const url = await UploadFirebase(file, setUploadProgress);
      handleClose();
      handleSubmit(url);
    } catch (error) {}
  };
  return (
    <div>
      <Modal className="text-dark" show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <h2 className="text-dark text-center">Edit Machine</h2>
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
                        labelIdle='<span className="filepond--label-action">Browse One</span>'
                        server={{
                          load: (
                            source,
                            load,
                            error,
                            progress,
                            abort,
                            headers
                          ) => {
                            var myRequest = new Request(source);
                            fetch(myRequest).then(function (response) {
                              response.blob().then(function (myBlob) {
                                load(myBlob);
                              });
                            });
                          },
                        }}
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
                        <option>{departmentID.nameDepartment}</option>
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
                    {preventiveActions && preventiveActions.map((action, index) => (
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
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              className="btn btn-warning"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
export default EditMachine;
