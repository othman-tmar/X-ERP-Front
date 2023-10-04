import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { getDifference,printDocument } from "../../utils/Functions";
import { UploadFirebase } from "../../utils/UploadFirebase";
import { Line } from "rc-progress";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DetailsCorrective = ({ corrective, showDetails, handleCloseDetails }) => {


  const moment = require('moment');

const dateNow = moment().format('DD/MM/YY HH:mm');
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
        
        <Form className="text-dark" >
        <div id="divToPrint" className="text-dark">
        <div style={{ margin: "60px" }}>
          <Modal.Header closeButton className="m-2">
            <h2 className="text-dark fw-bold fs-3">Corrective Maintenance {corrective.machineID.nameMachine} sheet</h2>
          </Modal.Header>
          <Modal.Body >
            <div className="container-lg ms-4 form mt-5  ">
                <Row className="mb-4">
                <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold ">Department :</Form.Label>
                      <br />
                      <React.Fragment>
                        {corrective.departmentID.nameDepartment}
                      </React.Fragment>
                    </Form.Group>

                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Machine :</Form.Label>
                      <br />
                      <React.Fragment>
                        {corrective.machineID.nameMachine}
                      </React.Fragment>
                    </Form.Group>
                </Row>
                <Row className="mb-4">
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Employee :</Form.Label>
                      <br />
                      <React.Fragment>
                        {corrective.employeeID.firstname}
                      </React.Fragment>
                    </Form.Group>
                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Status :</Form.Label>
                      <br />
                      <React.Fragment>
                        <span
                          style={{
                            color:
                              corrective.status === "Not completed"
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {corrective.status}
                        </span>
                      </React.Fragment>
                    </Form.Group>
                  </Row>

                <Row className="mb-4">
                <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Date Start :</Form.Label>
                      <br />
                      <React.Fragment>{corrective.dateStart}</React.Fragment>
                    </Form.Group>

                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Date End :</Form.Label>
                      <br />
                      <React.Fragment>{corrective.dateEnd}</React.Fragment>
                    </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} md="12">
                    <Form.Label className="fw-bold">Failure Cause</Form.Label>
                    <br />
                      <React.Fragment>{corrective.failureCause}</React.Fragment>
                  </Form.Group>
                </Row>
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
                      <React.Fragment>{corrective.description}</React.Fragment>
                    </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="fw-bold">Call Of  :</Form.Label>
                    <br />
                      <React.Fragment>{corrective.callOffBy}</React.Fragment>
                  </Form.Group>

                  <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">Date call :</Form.Label>
                      <br />
                      <React.Fragment>{corrective.dateCall}</React.Fragment>
                    </Form.Group>
                </Row>
                <Row className="mb-4">
                <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">
                        Occupation Time of {corrective.machineID.nameMachine} :
                      </Form.Label>
                      <br />
                      {corrective.dateEnd == "" ? (
                        <React.Fragment>
                          for now is {corrective.occupationTime}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>{corrective.occupationTime}</React.Fragment>
                      )}
                    </Form.Group>

                    <Form.Group as={Col} sm="6">
                      <Form.Label className="fw-bold">
                        Break Time of {corrective.machineID.nameMachine} :
                      </Form.Label>
                      <br />
                      {corrective.dateEnd == "" ? (
                        <React.Fragment>
                          for now is {corrective.breakTime}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>{corrective.breakTime}</React.Fragment>
                      )}
                    </Form.Group>
                </Row>
                <Row className="mb-4">
                <Form.Group as={Col} sm="7">
                    <Row >
                      <Form.Label className="fw-bold">
                        Total cost of this Maintenance (TND):&nbsp;
                        <React.Fragment >{corrective.costCorrective}</React.Fragment>
                      </Form.Label>
                     </Row>
                     <Row>
                      <Form.Label>
                      &nbsp; Storable Spare Part Cost (TND):&nbsp;
                      <React.Fragment>{corrective.storableSparePartCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      <Row>
                      <Form.Label>
                      &nbsp; Non Storable Spare Part Cost (TND):&nbsp;
                      <React.Fragment>{corrective.nonStorableSparePartCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      <Row>
                      <Form.Label>
                      &nbsp; Service Cost (TND):&nbsp;
                      <React.Fragment>{corrective.serviceCost}</React.Fragment>
                      </Form.Label>
                      </Row>
                      
                    </Form.Group>
                    </Row>
            </div>
          </Modal.Body>
          </div>
          </div>
          <Modal.Footer>
            <Button type="button" style={{ width: "100px" }}
            onClick={print}>
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

export default DetailsCorrective;
