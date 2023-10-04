import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./corrective.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createCorrective,
  getCorrectives,
} from "../../features/CorrecMainSlice";
import { updateMachine } from "../../features/MachineSlice";
import { getMachines } from "../../features/MachineSlice";
import { getDepartments } from "../../features/DepartmentSlice";
import { getEmployees } from "../../features/EmployeeSlice";
import { formatDate, getDifference } from "../../utils/Functions";
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { Line } from "rc-progress";

import { UploadFirebase } from "../../utils/UploadFirebase";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FormHelperText } from "@mui/material";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const CreateCorrective = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /* const [file, setFile] = useState(""); */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const [machineID, setMachineID] = useState("");
  const [checkedActionsEmployees, setCheckedActionsEmployees] = useState([]);
  const [dateStart, setDateStart] = useState();
  const [departmentID, setDepartmentID] = useState("");
  const [dateEnd, setDateEnd] = useState();
  const [failureCause, setFailureCause] = useState("Not defined");
  const [status, setStatus] = useState("Completed");
  const [breakTime, setBreakTime] = useState("");
  const [description, setDescription] = useState("");
  const [dateCall, setDateCall] = useState();
  const [callOffBy, setCallOffBy] = useState("");
  const [storableSparePartCost, setStorableSparePartCost] = useState("");
  const [nonStorableSparePartCost, setNonStorableSparePartCost] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [costCorrective, setCostCorrective] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [showInputStorableSpare, setShowInputStorableSpare] = useState(false);
  const [showInputNonStorableSpare, setShowInputNonStorableSpare] =
    useState(false);
  const [showInputServiceCost, setShowInputServiceCost] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const dispatch = useDispatch();

  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );
  const { machines } = useSelector((state) => state.storeMachines);
  const { employees } = useSelector((state) => state.storeEmployees);

  /* const [selectedOption, setSelectedOption] = useState(""); */
  const [otherText, setOtherText] = useState("");

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
    dispatch(getCorrectives());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
    const machine = machines.find((m) => m._id === machineID);
    setSelectedMachine(machine);
  }, [machineID]);

  useEffect(() => {
    let formattedStorableSparePartCost = parseFloat(
      storableSparePartCost
    ).toFixed(3);
    let formattedNonStorableSparePartCost = parseFloat(
      nonStorableSparePartCost
    ).toFixed(3);
    let formattedServiceCost = parseFloat(serviceCost).toFixed(3);
    setCostCorrective(
      parseFloat(formattedStorableSparePartCost) +
        parseFloat(formattedNonStorableSparePartCost) +
        parseFloat(formattedServiceCost)
    );
  }, [storableSparePartCost, nonStorableSparePartCost, serviceCost]);

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
  useEffect(() => {
    const currentDate = new Date();
    const endDate = new Date(dateEnd);

    if (dateEnd == "" || endDate > currentDate || dateEnd == undefined) {
      setStatus("Not completed");
    } else {
      setStatus("Completed");
    }
  }, [dateEnd]);

  const handleSubmit = (
    formattedDateStart,
    formattedDateEnd,
    formattedDateCall,
    breakTimeValue,
    occupationTime
  ) => {
    const Corrective = {
      machineID: machineID,
      employeeID: checkedActionsEmployees,
      departmentID: departmentID,
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      failureCause: failureCause,
      status: status,
      occupationTime: occupationTime,
      breakTime: breakTimeValue,
      description: description,
      dateCall: formattedDateCall,
      callOffBy: callOffBy,
      storableSparePartCost: storableSparePartCost,
      nonStorableSparePartCost: nonStorableSparePartCost,
      serviceCost: serviceCost,
      costCorrective: costCorrective,
    };

    dispatch(createCorrective(Corrective))
      .then((res) => {
        console.log("Insert OK", res);
        setMachineID("");
        setCheckedActionsEmployees([]);
        setDateStart("");
        setDateEnd("");
        setFailureCause("Not defined");
        setDescription("");
        setDateCall("");
        setCallOffBy("");
        setOtherText("");
        setShowInputStorableSpare(false);
        setShowInputNonStorableSpare(false);
        setShowInputServiceCost(false);
        setCostCorrective("");

        setValidated(false);
        /* setFile(""); */
        // If failureCause is otherText, update the machine's failureCause
        if (failureCause === otherText) {
          // Find the corresponding Machine
          const machine = machines.find((m) => m._id === Corrective.machineID);
          const machineUpdate = {
            _id: Corrective.machineID,
            failureCause: [
              ...machine.failureCause,
              { failure: Corrective.failureCause, date: Date.now() },
            ],
          };
          // Dispatch an action to update the machine
          dispatch(updateMachine(machineUpdate));
        }
       

        setUploadProgress(0);
        handleClose();
      })
      .catch((error) => {
        console.log(error);
        alert("Error of insertion");
      });
  };

  const handleRadioChangeStorableSpare = (event) => {
    setShowInputStorableSpare(event.target.value === "yes");
  };
  const handleRadioChangeNonStorableSpare = (event) => {
    setShowInputNonStorableSpare(event.target.value === "yes");
  };
  const handleRadioChangeServiceCost = (event) => {
    setShowInputServiceCost(event.target.value === "yes");
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!dateStart) {
      alert("Please insert a start date");
      return;
    }
    if (!dateCall) {
      alert("Please insert a call date");
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      let formattedDateStart = formatDate(dateStart);
      if (dateEnd !== undefined && dateEnd !== "") {
        let formattedDateEnd = formatDate(dateEnd);
        let formattedDateCall = formatDate(dateCall);
        if (dateEnd < dateStart || dateEnd.toString() == dateStart.toString()) {
          alert("End date should be after start date");
          return;
        }

        if (dateStart < dateCall) {
          alert("Call date should be before start date");
          return;
        }

        try {
          let occupationTime = getDifference(
            formattedDateStart,
            formattedDateEnd
          );
          let breakTimeValue = getDifference(
            formattedDateCall,
            formattedDateEnd
          );
          handleSubmit(
            formattedDateStart,
            formattedDateEnd,
            formattedDateCall,
            breakTimeValue,
            occupationTime
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        let formattedDateCall = formatDate(dateCall);
        setDateEnd("");
        handleSubmit(formattedDateStart, "", formattedDateCall, "", "");
      }
      /*  if (file) {
                if (!file[0].file) {
                    alert("Please upload an image first!");
                }
                else {
                    console.log(file[0].file)
                    resultHandleUpload(file[0].file, event);
                } */
    } else {
      alert("Please upload an image first!");
    }
    setValidated(true);
  };

  /* const resultHandleUpload = async (file) => {
        try {
const url = await UploadFirebase(file, setUploadProgress);
            handleSubmit(url)
        } catch (error) {
            console.log(error);
        }
    } */

  return (
    <>
      <Button
        onClick={handleShow}
        variant="success"
        size="sm"
        style={{ margin: 10, left: 10, fontFamily: "Arial" }}
      >
        <i className="fa-solid fa-circle-plus"></i>
        &nbsp; Create new Corrective Maintenance
      </Button>
      <Modal show={show} onHide={handleClose} className="text-dark ">
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <h3 className="text-dark text-center" align="center">
                Corrective Maintenance Form
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
                      {dateEnd && dateStart&& (dateEnd < dateStart || dateEnd.toString() == dateStart.toString()) &&
                        dateEnd !== "" && (
                          <FormHelperText error>
                            Date end should be after date start
                          </FormHelperText>
                        )}
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col} md="12">
                      <Form.Label>Failure Cause</Form.Label>
                      <Form.Control
                        as="select"
                        id="demo-simple-select"
                        value={failureCause}
                        onClick={() => {
                          document.getElementById(
                            "demo-simple-select"
                          ).options[0].style.display = "none";
                        }}
                        onChange={(e) => {
                          if (e.target.value === "other") {
                            setFailureCause(otherText);
                          } else {
                            setFailureCause(e.target.value);
                          }
                        }}
                      >
                        <option className="text-center">Select Failure</option>
                        <option value="other" className="text-danger">
                          Other
                        </option>
                        {!isLoading && selectedMachine
                          ? selectedMachine.failureCause.map((cause, index) => (
                              <option key={index} value={cause.failure}>
                                {cause.failure}
                              </option>
                            ))
                          : null}
                      </Form.Control>
                      {failureCause === otherText && (
                        <Form.Control
                          type="text"
                          style={{ marginTop: "7px" }}
                          id="standard-basic"
                          label="Other"
                          placeholder="Create failure "
                          value={otherText}
                          onChange={(e) => {
                            setOtherText(e.target.value);
                            setFailureCause(e.target.value);
                          }}
                        />
                      )}
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    {/* <Form.Group as={Col} md="6">
                      <Form.Label>Image</Form.Label>
                      <FilePond
                        files={file}
                        allowMultiple={false}
                        onupdatefiles={setFile}
                        labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                      />
                    </Form.Group> */}
                    {/* */}

                    <Form.Group as={Col} md="12">
                      <Form.Label>Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        type="text"
                        placeholder="Create description of this corrective maintenance "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Call Of By</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="This main was called by ... "
                        value={callOffBy}
                        onChange={(e) => setCallOffBy(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                      <Form.Label>Date Call</Form.Label>
                      <MuiPickersUtilsProvider utils={DateMomentUtils}>
                        <DateTimePicker
                          required
                          value={dateCall || null}
                          onChange={(date) => setDateCall(date)}
                        />
                      </MuiPickersUtilsProvider>
                      {dateStart < dateCall && (
                        <FormHelperText error>
                          Date call should be before date start
                        </FormHelperText>
                      )}
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="12">
                      <Form.Label>
                        Storable Spare Part Cost (TND) &nbsp;&nbsp;
                      </Form.Label>
                      <Form.Label> Yes &nbsp;</Form.Label>
                      <input
                        type="radio"
                        name="showInputStorableSpare"
                        value="yes"
                        onChange={handleRadioChangeStorableSpare}
                      />
                      <Form.Label> &nbsp; No &nbsp; </Form.Label>
                      <input
                        type="radio"
                        name="showInputStorableSpare"
                        value="no"
                        defaultChecked
                        onChange={handleRadioChangeStorableSpare}
                      />
                      {showInputStorableSpare && (
                          <Form.Control 
                          type="text" 
                          placeholder="Enter Storable spare part cost value"
                          onChange={(event) => {
                              const value = event.target.value;
                              if (!isNaN(value)) {
                                  setStorableSparePartCost(value);
                              }
                          }} 
                      />
                      )}
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="12">
                      <Form.Label>
                        Non Storable Spare Part Cost (TND) &nbsp;&nbsp;
                      </Form.Label>
                      <Form.Label> Yes &nbsp;</Form.Label>
                      <input
                        type="radio"
                        name="showInputNonStorableSpare"
                        value="yes"
                        onChange={handleRadioChangeNonStorableSpare}
                      />
                      <Form.Label> &nbsp; No &nbsp; </Form.Label>
                      <input
                        type="radio"
                        name="showInputNonStorableSpare"
                        value="no"
                        defaultChecked
                        onChange={handleRadioChangeNonStorableSpare}
                      />
                      {showInputNonStorableSpare && (
                         <Form.Control 
                         type="text" 
                         placeholder="Enter Non Storable spare part cost value"
                         onChange={(event) => {
                             const value = event.target.value;
                             if (!isNaN(value)) {
                                 setNonStorableSparePartCost(value);
                             }
                         }} 
                     />
                      )}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="12">
                      <Form.Label>Service Cost (TND) &nbsp;&nbsp;</Form.Label>
                      <Form.Label> Yes &nbsp;</Form.Label>
                      <input
                        type="radio"
                        name="showInputServiceCost"
                        value="yes"
                        onChange={handleRadioChangeServiceCost}
                      />
                      <Form.Label> &nbsp; No &nbsp; </Form.Label>
                      <input
                        type="radio"
                        name="showInputServiceCost"
                        value="no"
                        defaultChecked
                        onChange={handleRadioChangeServiceCost}
                      />
                      {showInputServiceCost && (
                          <Form.Control 
                          type="text" 
                          placeholder="Enter Service cost value"
                          onChange={(event) => {
                              const value = event.target.value;
                              if (!isNaN(value)) {
                                  setServiceCost(value);
                              }
                          }} 
                      />
                      )}
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
export default CreateCorrective;
