
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

    const [added, setAdded] = useState(new Date());
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleSave = () => {
      // Store reference to form to make later code easier to read
      const form = document.getElementById("additem__form");
      const image = document.getElementById("formImage").files[0]

      const formData = new FormData(form);
      formData.append("formImage", image);
      formData.append("formName", name);
      formData.append("formAdded",
        added.getDate() + "/" + (added.getMonth() + 1) + "/" + added.getFullYear()
      );
      formData.append("formQuantity", parseInt(quantity, 10));


      console.log(formData)
      // Post data using the Fetch API
      fetch(form.action, {
        method: form.method,
        body: formData,
      });
    }

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
            <Form id="additem__form" action="/api/items" method="POST">
              <Row>
                <Col>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  form="additem__form"
                  type="text"
                  placeholder="Enter item name"
                  value={name}
                  onChange={(evt) => {setName(evt.target.value)}}
                />
              </Form.Group>


              <Form.Group className="mb-3" controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  form="additem__form"
                  type="number"
                  value={quantity}
                  onChange={(evt) => {setQuantity(evt.target.value)}}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImage">
              <Row>
                <Col>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  form="additem__form"
                  type="file"
                  accept="image/*"
                  capture="camera"
                  onChange = {(evt) => {
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
                  onChange={setAdded}
                  value={added}
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
            <Button variant="primary" onClick={handleSave}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    );
}

export default AddItem;
