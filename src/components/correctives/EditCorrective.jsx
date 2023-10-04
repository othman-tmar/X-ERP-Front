import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import "./corrective.css";
import { updateCorrective } from "../../features/CorrecMainSlice";
import MachineSlice, { updateMachine } from "../../features/MachineSlice";
import { useDispatch, useSelector } from "react-redux";
import { UploadFirebase } from "../../utils/UploadFirebase";
import { Line } from "rc-progress";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { getDepartments } from "../../features/DepartmentSlice";
import { getEmployees } from "../../features/EmployeeSlice";
import { getMachines } from "../../features/MachineSlice";
import { formatDate, parseDate, getDifference } from "../../utils/Functions";
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FormHelperText } from "@mui/material";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditCorrective = ({ corrective, show, handleClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /*  const [file, setFile] = useState("");  */


  const [machineID, setMachineID] = useState("");
  const [checkedActionsEmployees, setCheckedActionsEmployees] = useState([]);
  const [dateStart, setDateStart] = useState(new Date());
  const [departmentID, setDepartmentID] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date());
  const [status, setStatus] = useState("");
  const [failureCause, setFailureCause] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [description, setDescription] = useState("");
  const [dateCall, setDateCall] = useState(new Date());
  const [callOffBy, setCallOffBy] = useState("");
  const [storableSparePartCost, setStorableSparePartCost] = useState("");
  const [nonStorableSparePartCost, setNonStorableSparePartCost] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [costCorrective, setCostCorrective] = useState("");
  const [otherText, setOtherText] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(corrective.machineID);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );
  const { machines } = useSelector((state) => state.storeMachines);
  const { employees } = useSelector((state) => state.storeEmployees);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  useEffect(() => {
    const currentDate = new Date();
    const endDate = new Date(dateEnd);

    if (dateEnd === "" || endDate > currentDate) {
      setStatus("Not completed");
    } else {
      setStatus("Completed");
    }
  }, [dateEnd]);

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

  useEffect(() => {
    let parsedDateStart = parseDate(corrective.dateStart);
    let parsedDateCall = parseDate(corrective.dateCall);

    if (corrective.dateEnd) {
      let parsedDateEnd = parseDate(corrective.dateEnd);
      setDateEnd(parsedDateEnd);
    } else setDateEnd("");
    setMachineID(corrective.machineID);
    setCheckedActionsEmployees(corrective.employeeID);
    setSelectedMachine(corrective.machineID);
    setDateStart(parsedDateStart);
    setDepartmentID(corrective.departmentID);
    setStatus(corrective.status);
    setFailureCause(corrective.failureCause);
    setBreakTime(corrective.breakTime);
    setDescription(corrective.description);
    setDateCall(parsedDateCall);
    setCallOffBy(corrective.callOffBy);
    setStorableSparePartCost(corrective.storableSparePartCost);
    setNonStorableSparePartCost(corrective.nonStorableSparePartCost);
    setServiceCost(corrective.serviceCost);

    /*   setFile([
            {
                source: corrective.image,
                options: { type: "local" }
            }
        ]); */
  }, [corrective]);

  useEffect(() => {
    const machine = machines.find((m) => m._id === machineID);
    setSelectedMachine(machine);
  }, [machineID]);

  const handleCheckChangeEmployees = (e, employee) => {
    const newCheckedActionsEmployees = [...checkedActionsEmployees];

    if (e.target.checked) {
      // If the checkbox is checked, add the employee to checkedActions
      newCheckedActionsEmployees.push(employee);
    } else {
      // If the checkbox is unchecked, remove the employee from checkedActions
      const actionIndex = newCheckedActionsEmployees.findIndex(
        (emp) => emp._id === employee._id
      );
      if (actionIndex !== -1) {
        newCheckedActionsEmployees.splice(actionIndex, 1);
      }
    }

    setCheckedActionsEmployees(newCheckedActionsEmployees);
  };

  const handleSubmit = (
    formattedDateStart,
    formattedDateEnd,
    formattedDateCall,
    breakTimeValue,
    occupationTime
  ) => {
    const Corrective = {
      ...corrective,
      machineID: machineID,
      employeeID: checkedActionsEmployees,
      departmentID: departmentID,
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      status: status,
      failureCause: failureCause,
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

    dispatch(updateCorrective(Corrective))
      .then((res) => {
        setUploadProgress(0);
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
      })
      .catch((error) => {
        console.log(error);
        alert("Error !");
      });
  };

  const handleUpload = (event) => {
    event.preventDefault();

    /*  if (dateEnd<dateStart) {
          alert("End date should be after start date");
          return;
        } */
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      let formattedDateStart = formatDate(dateStart);
      if (dateEnd !== undefined && dateEnd !== "") {
        let formattedDateEnd = formatDate(dateEnd);
        let formattedDateCall = formatDate(dateCall);
        if (formattedDateEnd <= formattedDateStart) {
          alert("End date should be after start date");
          return;
        }

        if (formattedDateStart < formattedDateCall) {
          alert("Call date should be before start date");
          return;
        }
        try {
          handleClose();
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
        handleClose();
        handleSubmit(formattedDateStart, "", formattedDateCall, "", "");
      }
      /*   if (!file) {
                const url = image;
                handleClose()
                handleSubmit(url)
            }
            else {
                resultHandleUpload(file[0].file, event);
            } */
    } else {
      alert("Please upload an image first!");
    }
    setValidated(true);
  };

  /*    const resultHandleUpload = async (file) => {
        try {
            const url = await UploadFirebase(file, setUploadProgress);
            handleClose()
            handleSubmit(url)
        } catch (error) {
        }
    } */
  return (
    <div>
      <Modal className="text-dark" show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <h2 className="text-dark text-center">Edit Corrective</h2>
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
                        <option>{machineID.nameMachine}</option>
                        {!isLoading
                          ? machines.map((mach) => (
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
                          checked={checkedActionsEmployees.some(
                            (e) => e._id === emp._id
                          )}
                        />
                      ))}
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Date Start</Form.Label>
                      <MuiPickersUtilsProvider utils={DateMomentUtils}>
                        <DateTimePicker
                          value={dateStart}
                          onChange={(date) => setDateStart(date)}
                          error={!dateStart}
                        />
                      </MuiPickersUtilsProvider>
                      <Form.Control.Feedback type="invalid">
                        Insert Date start
                      </Form.Control.Feedback>
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
                        {!isLoading
                          ? selectedMachine
                            ? selectedMachine.failureCause.map(
                                (cause, index) => (
                                  <option key={index} value={cause.failure}>
                                    {cause.failure}
                                  </option>
                                )
                              )
                            : corrective.machineID
                            ? corrective.machineID.failureCause.map(
                                (cause, index) => (
                                  <option key={index} value={cause.failure}>
                                    {cause.failure}
                                  </option>
                                )
                              )
                            : null
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
                  <Row className="mb-3">
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
                      <MuiPickersUtilsProvider
                        className="date-call"
                        utils={DateMomentUtils}
                      >
                        <DateTimePicker
                          value={dateCall}
                          onChange={(date) => setDateCall(date)}
                        />
                      </MuiPickersUtilsProvider>
                      {formatDate(dateStart) < formatDate(dateCall) && (
                        <FormHelperText error>
                          Date call should be before date start
                        </FormHelperText>
                      )}
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                      <Form.Label>Storable Spare Part Cost (TND)</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="Enter Storable spare part cost value"
                        value={storableSparePartCost}
                        step="0.001"
                        onChange={(e) =>
                          setStorableSparePartCost(e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Non Storable Spare Part Cost (TND)
                      </Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="Enter Non Storable spare part cost value"
                        value={nonStorableSparePartCost}
                        step="0.001"
                        onChange={(e) =>
                          setNonStorableSparePartCost(e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Service Cost (TND)&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp; &nbsp;{" "}
                      </Form.Label>
                      <br />

                      <Form.Control
                        type="number"
                        placeholder="Enter Service cost value"
                        value={serviceCost}
                        step="0.001"
                        onChange={(e) => setServiceCost(e.target.value)}
                      />
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
export default EditCorrective;
