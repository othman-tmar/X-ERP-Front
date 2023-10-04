import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import './preventive.css';
import { useDispatch, useSelector } from "react-redux";
import {
  createPreventive,
  getPreventives,
} from "../../features/PrevenMainSlice";
import { getMachines } from "../../features/MachineSlice";
import { getDepartments } from "../../features/DepartmentSlice";
import { getEmployees } from "../../features/EmployeeSlice";
import { formatDate ,getDifference} from "../../utils/Functions";
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Line } from "rc-progress";
/* import { UploadFirebase } from "../../utils/UploadFirebase"; */
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FormHelperText } from "@mui/material";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const CreatePreventive = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  /* const [file, setFile] = useState(""); */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const [machineID, setMachineID] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [status, setStatus] = useState("Completed");
  const [breakTime, setBreakTime] = useState("");
  const [description, setDescription] = useState("");
  const [storableSparePartCost, setStorableSparePartCost] = useState("");
  const [nonStorableSparePartCost, setNonStorableSparePartCost] = useState("");
  const [serviceCost, setServiceCost] = useState("");
  const [costPreventive, setCostPreventive] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [checkedActions, setCheckedActions] = useState([]);

 
  const [checkedActionsEmployees, setCheckedActionsEmployees] = useState([]);
  const dispatch = useDispatch();

  const [showInputStorableSpare, setShowInputStorableSpare] = useState(false);
  const [showInputNonStorableSpare, setShowInputNonStorableSpare] = useState(false);
  const [showInputServiceCost, setShowInputServiceCost] = useState(false);

  const { departments, isLoading } = useSelector(
    (state) => state.storeDepartments
  );
  const { machines } = useSelector((state) => state.storeMachines);
  const { employees } = useSelector((state) => state.storeEmployees);

  const handleCheckChange = (e, index) => {
    const newCheckedActions = [...checkedActions];

    if (e.target.checked) {
      // If the checkbox is checked, add the action to checkedActions
      newCheckedActions.push(checkList[index]);
    } else {
      // If the checkbox is unchecked, remove the action from checkedActions
      const actionIndex = newCheckedActions.indexOf(checkList[index]);
      newCheckedActions.splice(actionIndex, 1);
    }

    setCheckedActions(newCheckedActions);
  };

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
  
  

  const handleMachineChange = (e) => {
    const selectedMachineId = e.target.value;
    const selectedMachine = filteredMachines.find(
      (machine) => machine._id === selectedMachineId
    );

    // Update the checkList state with the preventiveActions of the selected machine
    setCheckList(selectedMachine.preventiveActions);

    // Update the machineID state
    setMachineID(selectedMachineId);
  };
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
    dispatch(getPreventives());
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

  useEffect(()=>{
    let formattedStorableSparePartCost = parseFloat(storableSparePartCost).toFixed(3);
    let formattedNonStorableSparePartCost = parseFloat(nonStorableSparePartCost).toFixed(3);
    let formattedServiceCost = parseFloat(serviceCost).toFixed(3);
    /* setCostPreventive(parseFloat(formattedStorableSparePartCost)+parseFloat(formattedNonStorableSparePartCost)+parseFloat(formattedServiceCost)) */
}, [storableSparePartCost,nonStorableSparePartCost,serviceCost])
  
useEffect(() => {
    const currentDate = new Date();
    const endDate = new Date(dateEnd);

    if (dateEnd === "" || endDate > currentDate || dateEnd == undefined) {
      setStatus("Not completed");
    } else {
      setStatus("Completed");
    }
  }, [dateEnd]);

  

  const handleSubmit = (formattedDateStart, formattedDateEnd,breakTimeValue) => {
    const Preventive = {
      machineID: machineID,
      employeeID: checkedActionsEmployees,
      departmentID: departmentID,
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      status: status,
      breakTime: breakTimeValue,
      description: description,
      preventiveActions: checkedActions,
      storableSparePartCost:storableSparePartCost,
      nonStorableSparePartCost:nonStorableSparePartCost,
      serviceCost:serviceCost,
      costPreventive:costPreventive,
    };


    dispatch(createPreventive(Preventive))
      .then((res) => {
        console.log("Insert OK", res);

        setMachineID("");
        
        setDepartmentID("");
        setDateStart("");
        setDateEnd("");
        setStatus("");
        setBreakTime("");
        setDescription("");
        setCheckedActions([]);
        setCheckedActionsEmployees([]);
         // Reset radio button states
        setShowInputStorableSpare(false);
        setShowInputNonStorableSpare(false);
        setShowInputServiceCost(false);
        setCostPreventive("");

        setValidated(false);
        /* setFile(""); */

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

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      let formattedDateStart = formatDate(dateStart);
      if (dateEnd !== undefined && dateEnd !== "") {
        let formattedDateEnd = formatDate(dateEnd);

        if (dateEnd < dateStart ||dateEnd.toString()==dateStart.toString()) {
         
          alert("End date should be after start date");
          return ;
        }

        try {
          let  breakTimeValue = getDifference(formattedDateStart,formattedDateEnd);
          handleSubmit(formattedDateStart, formattedDateEnd,breakTimeValue);
        } catch (error) {
          console.log(error);
        }
      } else {
        handleSubmit(formattedDateStart, "","");
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
        &nbsp; Create new Preventive Maintenance
      </Button>
      <Modal show={show} onHide={handleClose} className="text-dark">
        <Form noValidate validated={validated} onSubmit={handleUpload}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <h3 className="text-dark text-center" align="center">
                Preventive Maintenance Form
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
                        onChange={handleMachineChange}
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
                  <Row className="mb-3">
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
                      { dateEnd && dateStart&& (dateEnd < dateStart ||dateEnd.toString()==dateStart.toString() )&&(dateEnd!=="") && (
                        <FormHelperText error>
                          Date end should be after date start
                        </FormHelperText>
                      )}
                    </Form.Group>
                  </Row>
                  {machineID && 
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12">
                      <Form.Label>Preventive actions</Form.Label>
                      {checkList.map((action, index) => (
                        <Form.Check
                          type="checkbox"
                          label={action}
                          key={index}
                          onChange={(e) => handleCheckChange(e, index)}
                        />
                      ))}
                    </Form.Group>
                  </Row>
                   }


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
                  <Row className="mb-4">
                    <Form.Group as={Col} md="12">
                    <Form.Label>Storable Spare Part Cost (TND) &nbsp;&nbsp;</Form.Label>
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
                    <Form.Label>Non Storable Spare Part Cost (TND) &nbsp;&nbsp;</Form.Label>
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
                  <Row >
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
export default CreatePreventive;