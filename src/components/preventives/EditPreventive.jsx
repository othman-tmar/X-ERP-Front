import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import './preventive.css';
import { updatePreventive } from "../../features/PrevenMainSlice";
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
import {formatDate,parseDate,getDifference} from "../../utils/Functions"
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FormHelperText } from "@mui/material";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditPreventive = ({ preventive, show, handleClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /*  const [file, setFile] = useState("");  */

  const [machineID, setMachineID] = useState("");
  /* const [employeeID, setEmployeeID] = useState(""); */
  const [dateStart, setDateStart] = useState(new Date());
  const [departmentID, setDepartmentID] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date());
  const [status, setStatus] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [description, setDescription] = useState("");
  const [storableSparePartCost, setStorableSparePartCost] = useState("");
  const [nonStorableSparePartCost, setNonStorableSparePartCost] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [costPreventive, setCostPreventive] = useState("");
  const [checkedActionsEmployees, setCheckedActionsEmployees] = useState([]);

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
  useEffect(()=>{
    let formattedStorableSparePartCost = parseFloat(storableSparePartCost).toFixed(3);
    let formattedNonStorableSparePartCost = parseFloat(nonStorableSparePartCost).toFixed(3);
    let formattedServiceCost = parseFloat(serviceCost).toFixed(3);
    setCostPreventive(parseFloat(formattedStorableSparePartCost)+parseFloat(formattedNonStorableSparePartCost)+parseFloat(formattedServiceCost))
}, [storableSparePartCost,nonStorableSparePartCost,serviceCost])

  useEffect(() => {

    let parsedDateStart = parseDate(preventive.dateStart)
    if(preventive.dateEnd){
    let parsedDateEnd = parseDate(preventive.dateEnd)
    setDateEnd(parsedDateEnd);
  }else setDateEnd('');
    setMachineID(preventive.machineID);
    setCheckedActionsEmployees(preventive.employeeID);
    setDateStart(parsedDateStart);
    setDepartmentID(preventive.departmentID);
    setStatus(preventive.status);
    setBreakTime(preventive.breakTime);
    setDescription(preventive.description);
    setStorableSparePartCost(preventive.storableSparePartCost);
    setNonStorableSparePartCost(preventive.nonStorableSparePartCost);
    setServiceCost(preventive.serviceCost);

  }, [preventive]);

 

  const handleCheckChangeEmployees = (e, employee) => {
    const newCheckedActionsEmployees = [...checkedActionsEmployees];
  
    if (e.target.checked) {
      // If the checkbox is checked, add the employee to checkedActions
      newCheckedActionsEmployees.push(employee);
    } else {
      // If the checkbox is unchecked, remove the employee from checkedActions
      const actionIndex = newCheckedActionsEmployees.findIndex(emp => emp._id === employee._id);
      if (actionIndex !== -1) {
        newCheckedActionsEmployees.splice(actionIndex, 1);
      }
    }
    
    setCheckedActionsEmployees(newCheckedActionsEmployees);
  };
  

  const handleSubmit = (formattedDateStart, formattedDateEnd,breakTimeValue) => {
    const Preventive = {
      ...preventive,
      machineID: machineID,
      employeeID: checkedActionsEmployees,
      departmentID: departmentID,
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      status: status,
      breakTime: breakTimeValue,
      description: description,
      storableSparePartCost:storableSparePartCost,
      nonStorableSparePartCost:nonStorableSparePartCost,
      serviceCost:serviceCost,
      costPreventive:costPreventive,
    };

    dispatch(updatePreventive(Preventive))
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

    if (dateEnd<dateStart && dateEnd!=='') {
      alert("End date should be after start date");
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      let formattedDateStart = formatDate(dateStart);
      if( dateEnd !== undefined && dateEnd!==''){
      let formattedDateEnd = formatDate(dateEnd)
      if ( formattedDateEnd <= formattedDateStart) {
        alert("End date should be after start date");
        return;
    }

      try {
        handleClose()
        let  breakTimeValue = getDifference(formattedDateStart,formattedDateEnd);
        handleSubmit(formattedDateStart, formattedDateEnd,breakTimeValue);
      } catch (error) {
        console.log(error);
      }}else{
        handleClose();
        handleSubmit(formattedDateStart, "","")}
      /*  if (file) {
                if (!file[0].file) {
                    alert("Please upload an image first!");
                }
                else {
                    console.log(file[0].file)
                    resultHandleUpload(file[0].file, event);
                } */
    } else  {
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
            <h2 className="text-dark text-center">Edit Preventive</h2>
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

                  <Row className="mb-3">
                    <Form.Group as={Col} md="12">
                      <Form.Label> select Employees</Form.Label>
                      {employees.map((emp) => (
                        <Form.Check
                          type="checkbox"
                          label={emp.firstname + " " + emp.lastname}
                          key={emp._id}
                          onChange={(e) => handleCheckChangeEmployees(e, emp)}
                          checked={checkedActionsEmployees.some(e => e._id === emp._id)}

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
                      { formatDate(dateEnd) <=  formatDate(dateStart) && (
                          <FormHelperText error>
                             Date end should be after date start 
                          </FormHelperText>)}
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
                        placeholder="Create description of this preventive maintenance "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
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
                        onChange={(e) => setStorableSparePartCost(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Non Storable Spare Part Cost (TND)</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="Enter Non Storable spare part cost value"
                        value={nonStorableSparePartCost}
                        step="0.001"
                        onChange={(e) => setNonStorableSparePartCost(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Service Cost (TND)&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </Form.Label><br/>

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
export default EditPreventive;
