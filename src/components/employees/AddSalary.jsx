import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { updateEmployee } from "../../features/EmployeeSlice";
import { useDispatch } from "react-redux";
import { Line } from "rc-progress";
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddSalary = ({ employee, showDetails, handleCloseDetails }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const [laborCost, setLaborCost] = useState({
    workSchedule: "",
    salary: "",
    month: "",
  });

  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLaborCost((prevLaborCost) => ({
      ...prevLaborCost,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLaborCost(employee.laborCost);
  }, [employee]);

  const handleSubmit = () => {
    const empl = {
      ...employee,
      laborCost: [...employee.laborCost, laborCost],
    };

    dispatch(updateEmployee(empl))
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
      handleCloseDetails();
      handleSubmit();

      setValidated(true);
    }
  };

  return (
    <div>
      <Modal
        className="text-dark"
        show={showDetails}
        onHide={handleCloseDetails}
      >
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <h2 className="text-dark text-center">{employee.firstname}'s Salary</h2>
          </Modal.Header>
          <Modal.Body>
            <div className="container w-100 d-flex justify-content-center">
              <Row className="mb-2">
                <Form.Group as={Col} md="4">
                <Form.Label>
                  <h6 className="text-dark">Work Schedule</h6>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="workSchedule"
                  value={laborCost.workSchedule}
                  onChange={handleChange}
                />
                </Form.Group>
                <Form.Group as={Col} md="4">
                <Form.Label>
                  <h6 className="text-dark">Salary</h6>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={laborCost.salary}
                  onChange={handleChange}
                />
                </Form.Group>
                <Form.Group as={Col} md="4">
                <Form.Label>
                  <h6 className="text-dark">Month</h6>
                </Form.Label>
                <Form.Control
                    type="month"
                    name="month"
                  value={laborCost.month}
                  onChange={handleChange}
                />
                </Form.Group>
              </Row>
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
              onClick={handleCloseDetails}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
export default AddSalary;
