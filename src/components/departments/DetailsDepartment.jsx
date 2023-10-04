import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Image from 'react-bootstrap/Image';
import {printDocument } from "../../utils/Functions";


const DetailsDepartments = ({ department, showDetails, handleCloseDetails }) => {

      const print=()=>{
        let element = document.getElementById("divToPrint");
        printDocument(element)
       }
  
  return (
    <div> <Modal
    className="modal-lg text-dark"
    show={showDetails}
    onHide={handleCloseDetails}
    
  >
    
    <Form className="text-dark" >
    <div id="divToPrint" className="text-dark  ">
    <div  style={{margin:'40px'}}  >
      <Modal.Header closeButton className="m-2">
        <h2 className="text-dark fw-bold fs-3">Department details </h2>
      </Modal.Header>
      <Modal.Body >
        <div className="container w-100 d-flex justify-content-center ">
          <div className="form mt-3">
            
            <Row className="mb-3">
         

              <Form.Group as={Col} md="6">
              <Form.Label className="fw-bold">Name:</Form.Label>
                <br />
                        <React.Fragment>{department.nameDepartment}</React.Fragment>
              </Form.Group>
              <Form.Group as={Col} md="6">
              <Form.Label className="fw-bold">Image :</Form.Label>
                <Image src={department.imageDepartment} alt="Department" rounded style={{width: "100%", height: "auto"}} />

              </Form.Group>
            </Row>
            <Row className="mb-2">
              <Form.Group as={Col} md="6">
                <Form.Label className="fw-bold">Responsible :</Form.Label>
                <br />
                  <React.Fragment>{department.responsible}</React.Fragment>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label className="fw-bold">Number machine :</Form.Label>
                <br />
                  <React.Fragment>{department.nbMachine}</React.Fragment>
              </Form.Group>
            </Row>
            <Row className="mb-2">
              <Form.Group as={Col} md="6">
                <Form.Label className="fw-bold">Total cost of this department :</Form.Label>
                <br />
                  <React.Fragment>{department.cost}</React.Fragment>
              </Form.Group>

              
            </Row>
          </div>
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
  </Modal></div>
  )
}

export default DetailsDepartments