
import Button from 'react-bootstrap/Button'
import { useState } from "react";
import Modal from 'react-bootstrap/Modal'

import Form from 'react-bootstrap/Form'
import Calendar from 'react-calendar'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import 'react-calendar/dist/Calendar.css';
import './AddItem.css'

function AddItem() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [value, onChange] = useState(new Date());

    return (
      <div>
        <div class="floating-add">
          <Button variant="primary" onClick={handleShow}>+</Button>
        </div>
        <Modal show={show} onHide={handleClose} fullscreen={true}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Item to Freezer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter item name" />
              </Form.Group>


              <Form.Group className="mb-3" controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" defaultValue={1} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImage">
              <Row>
                <Col>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  capture="camera"
                  onChange = {function (evt) {
                    console.log("HELLO")
                    const src = URL.createObjectURL(evt.target.files[0])
                    document.getElementById('formImagePreview').src = src
                  }}

                />
                </Col>
                <Col>
                <img className="additem__image-preview" id="formImagePreview" />
                </Col>
                </Row>
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" controlId="formAdded">
                <Form.Label>Date Added</Form.Label>
                <Calendar
                  onChange={onChange}
                  value={value}
                />
              </Form.Group>
              </Col>
              </Row>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    );
}

export default AddItem;
