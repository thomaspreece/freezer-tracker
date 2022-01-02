
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

import List from './List'

function AddItem() {
    const [show, setShow] = useState(false);
    const [saveFailed, setSaveFailed] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [added, setAdded] = useState(new Date());
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES.LEFTOVERS);
    const [quantity, setQuantity] = useState(1);
    const [imageSuggestions, setImageSuggestions] = useState({
      search: "",
      suggestions: [],
      inProgress: false,
      error: false,
    })
    const [selectedImageSuggestion, setSelectedImageSuggestion] = useState(0);

    const IMAGE_PREVIEW_MODES = {
      HIDDEN: "hidden",
      SUGGESTION: "suggestion",
      UPLOAD: "upload"
    }

    const [imagePreviewMode, setImagePreviewMode] = useState(IMAGE_PREVIEW_MODES.HIDDEN)

    const hasImageSuggestions = (imageSuggestions.search !== "" &&
      imageSuggestions.suggestions.length > 0 &&
      imageSuggestions.error === false &&
      imageSuggestions.inProgress === false)

    const noImageSuggestions = (imageSuggestions.search !== "" &&
      imageSuggestions.suggestions.length === 0 &&
      imageSuggestions.error === false &&
      imageSuggestions.inProgress === false)

    const imageSelected = (evt) => {
      setImagePreviewMode(IMAGE_PREVIEW_MODES.UPLOAD)
      const src = URL.createObjectURL(evt.target.files[0])
      const element = document.getElementById('formImagePreview')
      element.src = src
    }

    const suggestImage = async () => {
      try {
        setImagePreviewMode(IMAGE_PREVIEW_MODES.SUGGESTION)
        setSelectedImageSuggestion(0)

        if (imageSuggestions.search === name && imageSuggestions.error === false) {
          return
        }

        setImageSuggestions({
          search: name,
          suggestions: [],
          inProgress: true,
          error: false,
        })

        const response = await fetch("/api/images/suggest", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({search: name}),
        });
        const json = await response.json();
        const urls = json.map((suggestion) => suggestion.url)

        setImageSuggestions({
          search: name,
          suggestions: urls,
          inProgress: false,
          error: false,
        })

      } catch(error) {
        setImageSuggestions({
          search: name,
          suggestions: [],
          inProgress: false,
          error: true,
        })
      }

    }

    const handleSave = async () => {
      setSaveFailed(false)

      try {
        const form = document.getElementById("additem__form");
        const formData = new FormData(form);

        formData.append("formName", name);
        formData.append("formCategory", category);
        formData.append("formAdded",
          added.getDate() + "/" + (added.getMonth() + 1) + "/" + added.getFullYear()
        );
        formData.append("formQuantity", parseInt(quantity, 10));

        if (imagePreviewMode === IMAGE_PREVIEW_MODES.UPLOAD) {
          const image = document.getElementById("formImage").files[0]
          formData.append("formImage", image);
        } else if (imagePreviewMode === IMAGE_PREVIEW_MODES.SUGGESTION) {
          formData.append("formImageFetchUrl", imageSuggestions.suggestions[selectedImageSuggestion]);
        } else {
          return
        }

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
                <Col xs={12} md={12} lg={7}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  form="additem__form"
                  type="text"
                  placeholder="Enter item name"
                  value={name}
                  onChange={(evt) => {setName(evt.target.value)}}
                />
                <List ignoreStoredFilterAndSort={true} overrideFilter={name} />
                <hr />
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
                <hr />
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
                  <Col xs={12} md={12} lg={5}>
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
              <hr />
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
                    onChange = {imageSelected}
                  />
                  <Button className="quantity-buttons" variant="secondary" onClick={() => {suggestImage()}} disabled={imageSuggestions.inProgress}>
                    Suggest Image
                  </Button>
                </Col>
                <Col>
                  <img alt="preview" className={`additem__image-preview ${imagePreviewMode === IMAGE_PREVIEW_MODES.UPLOAD ? "preview-shown" : ""}`} id="formImagePreview" />
                  <div className={`additem__image-suggestion ${imagePreviewMode === IMAGE_PREVIEW_MODES.SUGGESTION && hasImageSuggestions ? "preview-shown" : ""}`} >
                    {imageSuggestions.inProgress === true ? <Alert variant={'info'}>
                        Loading Suggestions
                      </Alert> : null}
                    {imageSuggestions.error === true ? <Alert variant={'danger'}>
                        Error obtaining image suggestions
                      </Alert> : null}
                    {noImageSuggestions === true ? <Alert variant={'warning'}>
                        Could not find any suggestions for image
                      </Alert> : null}
                    <Button className="quantity-buttons" variant="secondary" onClick={() => {
                        if((selectedImageSuggestion - 1) <= -1) {
                          setSelectedImageSuggestion(imageSuggestions.suggestions.length - 1)
                        } else {
                          setSelectedImageSuggestion(selectedImageSuggestion - 1)}
                        }
                      }>{"<"}</Button>
                    <img alt="preview" className="additem__image-suggestion-preview" src={imageSuggestions.suggestions[selectedImageSuggestion]} id="formImageSuggestionPreview"/>
                    <Button className="quantity-buttons" variant="secondary" onClick={() => {
                        if(selectedImageSuggestion + 1 >= imageSuggestions.suggestions.length) {
                          setSelectedImageSuggestion(0)
                        } else {
                          setSelectedImageSuggestion(selectedImageSuggestion + 1)
                        }
                      }}>{">"}</Button>
                  </div>
                </Col>
                </Row>
                <hr />
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
