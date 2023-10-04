import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { getDifference, printDocument } from "../../utils/Functions";
import { UploadFirebase } from "../../utils/UploadFirebase";
import { Line } from "rc-progress";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

const DetailsPreventive = ({ preventive, showDetails, handleCloseDetails }) => {
  const moment = require("moment");

  const dateNow = moment().format("DD/MM/YY HH:mm");
  /* const printDocument = () => {
      const input = document.getElementById('divToPrint');
      html2canvas(input, { scale: 2 }) // Increase the resolution of the canvas
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const doc = new jsPDF('p', 'mm', 'a4');
          const width = doc.internal.pageSize.getWidth();
          const height = doc.internal.pageSize.getHeight();
          doc.addImage(imgData, 'JPEG', 0, 0, width, height);
          printDate(doc)
          doc.save("download.pdf");
        });
    } */

  const print = () => {
    let element = document.getElementById("divToPrint");
    printDocument(element);
  };

  return (
    <div>
      <Modal
        className="modal-lg text-dark"
        show={showDetails}
        onHide={handleCloseDetails}
      >
        <Form className="text-dark">
          <div id="divToPrint" className="text-dark">
            <div style={{ margin: "60px" }}>
              <Modal.Header closeButton className="m-2">
                <h2 className="text-dark fw-bold fs-3">
                  Preventive Maintenance {preventive.machineID.nameMachine}{" "}
                  sheet
                </h2>
              </Modal.Header>
              <Modal.Body>
                <div className=" container-lg ms-4 form mt-5  ">
                  <Row className="mb-4">
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold ">Department :</Form.Label>
                      <br />
                      <React.Fragment>
                        {preventive.departmentID.nameDepartment}
                      </React.Fragment>
                    </Form.Group>

                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Machine :</Form.Label>
                      <br />
                      <React.Fragment>
                        {preventive.machineID.nameMachine}
                      </React.Fragment>
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                  <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Employee :</Form.Label>
                      <br />
                      {preventive.employeeID.map((emp, index) => (
                          <React.Fragment key={index}>
                            - {emp.firstname} {emp.lastname}
                            <br />
                          </React.Fragment>
                        ))}
                    </Form.Group>
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Status :</Form.Label>
                      <br />
                      <React.Fragment>
                        <span
                          style={{
                            color:
                              preventive.status === "Not completed"
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {preventive.status}
                        </span>
                      </React.Fragment>
                    </Form.Group>
                  </Row>

                  <Row className="mb-4">
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Date Start :</Form.Label>
                      <br />
                      <React.Fragment>{preventive.dateStart}</React.Fragment>
                    </Form.Group>

                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Date End :</Form.Label>
                      <br />
                      <React.Fragment>{preventive.dateEnd}</React.Fragment>
                    </Form.Group>
                  </Row>

                  {preventive.preventiveActions != [""] && (
                    <Row className="mb-4">
                      <Form.Group as={Col} md="12">
                        <Form.Label className="fw-bold">
                          Preventive actions :
                        </Form.Label>
                        <br />
                        {preventive.preventiveActions.map((action, index) => (
                          <React.Fragment key={index}>
                            - {action}
                            <br />
                          </React.Fragment>
                        ))}
                      </Form.Group>
                    </Row>
                  )}

                  <Row className="mb-4">
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
                      <Form.Label className="fw-bold">Description :</Form.Label>
                      <br />
                      <React.Fragment>{preventive.description}</React.Fragment>
                    </Form.Group>
                  </Row>

                  <Row className="mb-4">
                  <Form.Group as={Col} sm="7">
                  <Row >
                      <Form.Label className="fw-bold">
                        Total cost of this Maintenance (TND):&nbsp;
                        <React.Fragment >{preventive.costPreventive}</React.Fragment>
                      </Form.Label>
                      </Row>
                      <Row>
                      <Form.Label>
                      &nbsp; Storable Spare Part Cost (TND):&nbsp;
                      <React.Fragment>{preventive.storableSparePartCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      <Row>
                      <Form.Label>
                      &nbsp; Non Storable Spare Part Cost (TND):&nbsp;
                      <React.Fragment>{preventive.nonStorableSparePartCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      <Row>
                      <Form.Label>
                      &nbsp; Service Cost (TND):&nbsp;
                      <React.Fragment>{preventive.serviceCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      
                      
                    </Form.Group>
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">
                        Break Time of {preventive.machineID.nameMachine} :
                      </Form.Label>
                      <br />
                      {preventive.dateEnd == "" ? (
                        <React.Fragment>
                          for now is {preventive.breakTime}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>{preventive.breakTime}</React.Fragment>
                      )}
                    </Form.Group>
                  </Row>
                
                </div>
              </Modal.Body>
            </div>
          </div>
          <Modal.Footer>
            <Button type="button" style={{ width: "100px" }} onClick={print}>
              Print
            </Button>
            <Button
              type="button"
              className="btn btn-warning"
              onClick={handleCloseDetails}
              style={{ width: "100px" }}
            >
              Previous
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailsPreventive;
