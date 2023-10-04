import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import {
  createPreventivePlanif,
  getPreventivePlanifs,
} from "../../features/PreventivePlanifSlice";
import { getMachines } from "../../features/MachineSlice";
import { getDepartments } from "../../features/DepartmentSlice";
import { getEmployees } from "../../features/EmployeeSlice";
import { formatDate } from "../../utils/Functions";
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Line } from "rc-progress";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FormHelperText } from "@mui/material";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const CreatePreventivePlanif = ({
  showCreate,
  setShowCreate,
  handleCloseCreate,
  dateStartCreate,
  dateEndCreate,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleClose = () => setShowCreate(false);
  const [validated, setValidated] = useState(false);

  const [machineID, setMachineID] = useState("");
  const [checkedActionsEmployees, setCheckedActionsEmployees] = useState([]);
  const [departmentID, setDepartmentID] = useState("");
  const [dateStart, setDateStart] = useState(dateStartCreate);
  const [dateEnd, setDateEnd] = useState(dateEndCreate);

  const [notifBefore, setNotifBefore] = useState({
    interventionDate: false,
    day: false,
    week: false,
    month: false,
  });

  const [filteredMachines, setFilteredMachines] = useState([]);

  const dispatch = useDispatch();

  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );
  const { machines } = useSelector((state) => state.storeMachines);
  const { employees } = useSelector((state) => state.storeEmployees);

  useEffect(() => {
    if (departmentID) {
      setFilteredMachines(
        machines.filter((mach) => mach.departmentID._id == departmentID)
      );
    } else {
      setFilteredMachines(machines);
    }
  }, [departmentID, machines]);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const handleCheckChangeEmployees = (e, employee) => {
    const newCheckedActionsEmployees = [...checkedActionsEmployees];

    if (e.target.checked) {
      // If the checkbox is checked, add the employee to checkedActions
      newCheckedActionsEmployees.push(employee);
    } else {
      // If the checkbox is unchecked, remove the employee from checkedActions
      const actionIndex = newCheckedActionsEmployees.indexOf(employee);
      if (actionIndex !== -1) {
        newCheckedActionsEmployees.splice(actionIndex, 1);
      }
    }
    setCheckedActionsEmployees(newCheckedActionsEmployees);
  };

  const handleSubmit = (formattedDateStart, formattedDateEnd) => {
    const Preventive = {
      machineID: machineID,
      employeeID: checkedActionsEmployees,
      departmentID: departmentID,
      notifBefore:notifBefore,
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
    };
    

    dispatch(createPreventivePlanif(Preventive))
      .then((res) => {
        console.log("Insert OK", res);

        setMachineID("");
        setCheckedActionsEmployees([]);
        setDepartmentID("");
        setDateStart("");
        setDateEnd("");

        setValidated(false);
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
    if (!dateStart) {
      alert("Please insert a start date");
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      let formattedDateStart = formatDate(dateStart);
      if (dateEnd !== undefined && dateEnd !== "") {
        let formattedDateEnd = formatDate(dateEnd);

        if (formattedDateEnd <= formattedDateStart) {
          alert("End date should be after start date");
          return;
        }
        try {
          handleSubmit(formattedDateStart, formattedDateEnd);
        } catch (error) {
          console.log(error);
        }
      } else {
        handleSubmit(formattedDateStart, "");
      }
    } else {
      alert("Please upload an image first!");
    }
    setValidated(true);
  };

  const handleCheckChangeNotifBefore = (event, key) => {
    setNotifBefore({ ...notifBefore, [key]: event.target.checked });
  };
  
  const selectAllNotifBefore = () => {
    setNotifBefore({
      interventionDate: true,
      day: true,
      week: true,
      month: true,
    });
  };
  

  return (
    <>
      <Modal show={showCreate} onHide={handleCloseCreate} className="text-dark">
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <h3 className="text-dark text-center" align="center">
                Preventive Planification Form
              </h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container w-100 d-flex justify-content-center">
              <div>
                <div className="form mt-3">
                  <Row className="mb-2">
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

                  <Row className="mb-2">
                    <Form.Group as={Col} md="12">
                      <Form.Label>
                        <h6 className="text-dark">Machine</h6>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        type="select"
                        id="select-machine"
                        value={machineID}
                        onChange={(e) => setMachineID(e.target.value)}
                        onClick={() => {
                          document.getElementById(
                            "select-machine"
                          ).options[0].style.display = "none";
                        }}
                      >
                        <option className="text-center">Select Machine</option>
                        {!isLoading
                          ? filteredMachines.map((mach) => (
                              <option key={mach._id} value={mach._id}>
                                {mach.nameMachine}
                              </option>
                            ))
                          : null}
                      </Form.Control>
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col} md="12">
                      <Form.Label> select Employees</Form.Label>
                      {employees.map((emp) => (
                        <Form.Check
                          type="checkbox"
                          label={emp.firstname + " " + emp.lastname}
                          key={emp._id}
                          onChange={(e) => handleCheckChangeEmployees(e, emp)}
                        />
                      ))}
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Date Start</Form.Label>
                      <MuiPickersUtilsProvider utils={DateMomentUtils}>
                        <DateTimePicker
                          required
                          value={dateStart || null}
                          onChange={(date) => setDateStart(date)}
                          error={!dateStart}
                        />
                        {!dateStart && (
                          <FormHelperText error>
                            Insert Date start
                          </FormHelperText>
                        )}
                      </MuiPickersUtilsProvider>
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                      <Form.Label>Date End</Form.Label>
                      <MuiPickersUtilsProvider utils={DateMomentUtils}>
                        <DateTimePicker
                          value={dateEnd || null}
                          onChange={(date) => setDateEnd(date)}
                        />
                      </MuiPickersUtilsProvider>
                      {formatDate(dateEnd) <= formatDate(dateStart) && (
                        <FormHelperText error>
                          Date end should be after date start
                        </FormHelperText>
                      )}
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col} md="12">
                      <Form.Label>Remind me before</Form.Label>
                      {Object.keys(notifBefore).map((key) => (
                        <Form.Check
                          type="checkbox"
                          label={key}
                          key={key}
                          checked={notifBefore[key]}
                          onChange={(e) => handleCheckChangeNotifBefore(e, key)}
                        />
                      ))}
                      <Button variant="primary" onClick={selectAllNotifBefore}>
                        Select All
                      </Button>
                    </Form.Group>
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
            <Button variant="secondary" onClick={handleCloseCreate}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default CreatePreventivePlanif;
