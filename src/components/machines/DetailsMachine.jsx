import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import { printDocument } from "../../utils/Functions";

const DetailsMachine = ({ machine, showDetails, handleCloseDetails }) => {
  
 
  /* const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input, { scale: 15, useCORS: true }) // Increase the resolution of the canvas
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF("l", "mm", "a4");
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, "JPEG", 0, 0, width, height);
        printDate(doc);
        doc.save("download.pdf");
      });
  }; */

 
 const print=()=>{
  let element = document.getElementById("divToPrint");
  printDocument(element)
 }

  return (
    <div>
      {" "}
      <Modal
        className="modal-lg text-dark"
        show={showDetails}
        onHide={handleCloseDetails}
      >
        <Form className="text-dark">
          <div id="divToPrint" className="text-dark  ">
            <div  style={{margin:'40px'}}  >
              <Modal.Header closeButton className="m-2">
                <h2 className="text-dark fw-bold fs-3">Machine details </h2>
              </Modal.Header>
              <Modal.Body >
                <div className="container w-100 d-flex justify-content-center ">
                  <div className="form mt-3">
                    <Row className="mb-4 ">
                      <Form.Group as={Col} md="4">
                        <Form.Label className="fw-bold">Name:</Form.Label>
                        <br />
                        <React.Fragment>{machine.nameMachine}</React.Fragment>
                      </Form.Group>

                      <Form.Group as={Col} md="4">
                        <Form.Label className="fw-bold">Reference :</Form.Label>
                        <br />
                        <React.Fragment>
                          {machine.referenceMachine}
                        </React.Fragment>
                      </Form.Group>
                      <Form.Group as={Col} md="4">
                        <Form.Label className="fw-bold">Image :</Form.Label>
                        <Image
                          src={machine.image}
                          alt="Machine"
                          rounded
                          style={{ width: "100%", height: "auto" }}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-4">
                      <Form.Group as={Col} md="6">
                        <Form.Label className="fw-bold">Department :</Form.Label>
                        <br />

                        <React.Fragment>
                          {machine.departmentID.nameDepartment}
                        </React.Fragment>
                      </Form.Group>

                      <Form.Group as={Col} md="6">
                        <Form.Label className="fw-bold">Production time /h :</Form.Label>
                        <br />
                        <React.Fragment>
                          {machine.productionTime}
                        </React.Fragment>
                      </Form.Group>
                    </Row>

                    <Row className="mb-4">
                      <Form.Group as={Col} md="6">
                        <Form.Label className="fw-bold">
                          Number of preventive maintenance /week :
                        </Form.Label>
                        <br />
                        <React.Fragment>
                          {machine.nbPreMainInWeek}
                        </React.Fragment>
                      </Form.Group>

                      <Form.Group as={Col} md="6">
                        <Form.Label className="fw-bold">Total cost of this machine :</Form.Label>
                        <br />
                        <React.Fragment>{machine.cost}</React.Fragment>
                      </Form.Group>
                    </Row>
                    {machine.preventiveActions && 
                    <Row className="mb-4">
                      <Form.Group as={Col} md="12">
                        <Form.Label className="fw-bold">Preventive actions :</Form.Label>
                        <br />
                        {machine.preventiveActions.map((action, index) => (
                          <React.Fragment key={index}>
                            - {action}
                            <br />
                          </React.Fragment>
                        ))}
                      </Form.Group>
                    </Row>
                    }
                  </div>
                </div>
              </Modal.Body>
            </div>
          </div>
          <Modal.Footer>
            <Button
              type="button"
              style={{ width: "100px" }}
              onClick={print}
            >
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

export default DetailsMachine;
