
import Button from 'react-bootstrap/Button'
import { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Calendar from 'react-calendar'
import SwitchSelector from "react-switch-selector";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Alert from 'react-bootstrap/Alert'

import 'react-calendar/dist/Calendar.css';
import './AddItem.css'

import { CATEGORIES } from '../store/filters'

function AddItem() {
    const [show, setShow] = useState(false);
    const [saveFailed, setSaveFailed] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [added, setAdded] = useState(new Date());
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES.LEFTOVERS);
    const [quantity, setQuantity] = useState(1);

    const handleSave = async () => {
      setSaveFailed(false)

      try {
        // Store reference to form to make later code easier to read
        const form = document.getElementById("additem__form");
        const image = document.getElementById("formImage").files[0]

        const formData = new FormData(form);

        formData.append("formName", name);
        formData.append("formCategory", category);
        formData.append("formAdded",
          added.getDate() + "/" + (added.getMonth() + 1) + "/" + added.getFullYear()
        );
        formData.append("formQuantity", parseInt(quantity, 10));
        formData.append("formImage", image);
        // Post data using the Fetch API
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
        });

        if(response.status === 200) {
          handleClose();
        } else {
          setSaveFailed(true)
        }

      } catch (error) {
        console.log("Save Item Failed: ", error)
        setSaveFailed(true)
      }
    }

    const options = [];
    const switchSelectorOptions = [];
    Object.values(CATEGORIES).forEach((c) => {
      options.push(<option>{c}</option>)
      switchSelectorOptions.push({
         label: c,
         value: c,
         selectedBackgroundColor: "#0d6efd"
       })
    })

    const switchSelectorIndex = switchSelectorOptions.findIndex((option) => option.label === category)

    return (
      <div>
        <div className="floating-add">
          <Button variant="primary" onClick={handleShow}>+</Button>
        </div>
        <Modal show={show} onHide={handleClose} fullscreen={true}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Item to Freezer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {saveFailed === true ? <Alert variant={'danger'}>
                Saving new item failed
              </Alert> : null}
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

              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <div className="switchselector-category">
                  <SwitchSelector
                      onChange={(value) => {setCategory(value)}}
                      options={switchSelectorOptions}
                      initialSelectedIndex={switchSelectorIndex}
                      backgroundColor={"#6c757d"}
                      fontColor={"#f5f6fa"}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  form="additem__form"
                  type="number"
                  value={quantity}
                  onChange={(evt) => {setQuantity(evt.target.value)}}
                />
                <Row>
                  <Col>
                <Button className="quantity-buttons" variant="secondary" onClick={() => {setQuantity(quantity - 1)}}>
                  -1
                </Button>
              </Col>
              <Col>
                <Button className="quantity-buttons" variant="secondary" onClick={() => {setQuantity(quantity + 1)}}>
                  +1
                </Button>
                </Col>
              </Row>
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
                    const element = document.getElementById('formImagePreview')
                    element.src = src
                    element.classList.add("preview-shown");
                  }}
                />
                </Col>
                <Col>
                  <img alt="preview" className="additem__image-preview" id="formImagePreview" />
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
