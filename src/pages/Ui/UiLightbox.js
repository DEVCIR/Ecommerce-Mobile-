import React, { useEffect, useState } from "react"

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import { Link } from "react-router-dom"

//Lightbox
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import ModalVideo from "react-modal-video"
import "react-modal-video/scss/modal-video.scss"

// import image
import img1 from "../../assets/images/small/img-1.jpg"
import img2 from "../../assets/images/small/img-2.jpg"
import img3 from "../../assets/images/small/img-3.jpg"
import img4 from "../../assets/images/small/img-4.jpg"
import img5 from "../../assets/images/small/img-5.jpg"
import img6 from "../../assets/images/small/img-6.jpg"
import img7 from "../../assets/images/small/img-7.jpg"

import { connect } from "react-redux"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions"

const images = [img1, img2, img3, img4, img5, img6]
const images1 = [img3, img7];

const UiLightbox = props => {
  document.title = "Lightbox | Lexa - Responsive Bootstrap 5 Admin Dashboard"

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "UI Elements", link: "#" },
    { title: "Lightbox", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Lightbox", breadcrumbItems)
  })

  const [open, setOpen] = useState(false)
  const [photoIndex, setphotoIndex] = useState(0)
  const [isFits, setisFits] = useState(false)
  const [isEffects, setisEffects] = useState(false)
  const [isGallery, setisGallery] = useState(false)
  const [isGalleryZoom, setisGalleryZoom] = useState(false)
  const [isOpen, setisOpen] = useState(false)
  const [isOpen1, setisOpen1] = useState(false)
  const [modal, setmodal] = useState(false)

  return (
    <React.Fragment>
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={images.map(image => ({ src: image }))}
        />
      )}

      {isEffects && (
        <Lightbox
          open={isEffects}
          close={() => setisEffects(false)}
          index={photoIndex}
          slides={images.map(image => ({ src: image }))}
        />
      )}

      {isGallery && (
        <Lightbox
          open={isGallery}
          close={() => setisGallery(false)}
          index={photoIndex}
          slides={images.map(image => ({ src: image }))}
        />
      )}

      {isGalleryZoom && (
        <Lightbox
          open={isGalleryZoom}
          close={() => setisGalleryZoom(false)}
          index={isFits}
          slides={images1.map(image => ({ src: image }))}
        />
      )}

      <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Single image lightbox</CardTitle>
              <p className="card-title-desc">
                Three simple popups with different scaling settings.
              </p>
              <Row>
                <Col className="col-6">
                  <div>
                    <h5 className="font-size-14 mb-3 text-muted">
                      Fits (Horz/Vert)
                    </h5>
                    <Link
                      to="#"
                      className="image-popup-vertical-fit"
                      title="Caption. Can be aligned it to any side and contain any HTML."
                    >
                      <img
                        onClick={() => {
                          setisFits(true)
                        }}
                        className="img-fluid"
                        alt="Lexa"
                        src={img2}
                        width="145"
                      />
                    </Link>
                  </div>
                </Col>
                <Col className="col-6">
                  <h5 className="font-size-14 mb-3 text-muted">Effects</h5>
                  <Link to="#" className="image-popup-no-margins">
                    <img
                      onClick={() => {
                        setisEffects(true)
                      }}
                      className="img-fluid"
                      alt=""
                      src={img3}
                      width="75"
                    />
                  </Link>
                  <CardText className="mt-2 mb-0 text-muted">
                    No gaps, zoom animation, close icon in top-right corner.
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Lightbox gallery</CardTitle>
              <p className="card-title-desc">
                In this example lazy-loading of images is enabled for the next
                image based on move direction.{" "}
              </p>
              <div className="popup-gallery">
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img1}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(0)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img2}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(1)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img3}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(2)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img4}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(3)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img5}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(4)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
                <Link to="#" className="float-start">
                  <div className="img-responsive">
                    <img
                      src={img6}
                      onClick={() => {
                        setisGallery(true)
                        setphotoIndex(5)
                      }}
                      alt=""
                      width="120"
                    />
                  </div>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Zoom Gallery</CardTitle>
              <p className="card-title-desc">
                Zoom effect works only with images.
              </p>

              <div className="zoom-gallery">
                <img
                  src={img3}
                  className="float-start"
                  onClick={() => {
                    setisGallery(true)
                    setphotoIndex(2)
                  }}
                  alt=""
                  width="275"
                />
                <img
                  src={img7}
                  className="float-start"
                  onClick={() => {
                    setisGallery(true)
                    setphotoIndex(4)
                  }}
                  alt=""
                  width="275"
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Popup with video or map</CardTitle>
              <p className="card-title-desc">
                In this example lazy-loading of images is enabled for the next
                image based on move direction.{" "}
              </p>

              <Row>
                <Col>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      className="btn btn-secondary me-1 mt-2"
                      onClick={() => {
                        setisOpen(!isOpen)
                      }}
                    >
                      Open Youtube Video
                    </Button>{" "}
                    <Button
                      className="btn btn-secondary me-1 mt-2"
                      onClick={() => {
                        setisOpen1(!isOpen1)
                      }}
                    >
                      Open Vimeo Video
                    </Button>{" "}
                    <ModalVideo
                      videoId="L61p2uyiMSo"
                      channel="youtube"
                      isOpen={isOpen}
                      onClose={() => {
                        setisOpen(!isOpen)
                      }}
                    />
                    <ModalVideo
                      videoId="L61p2uyiMSo"
                      channel="youtube"
                      isOpen={isOpen1}
                      onClose={() => {
                        setisOpen1(false)
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="mb-4">Popup with form</CardTitle>
              <div>
                <Link
                  onClick={() => {
                    setmodal(!modal)
                  }}
                  to="#"
                  className="popup-form btn btn-primary"
                >
                  Popup form
                </Link>
              </div>

              <Modal
                size="lg"
                isOpen={modal}
                toggle={() => {
                  setmodal(!modal)
                }}
              >
                <ModalHeader
                  toggle={() => {
                    setmodal(!modal)
                  }}
                >
                  Form
                </ModalHeader>
                <ModalBody>
                  <form>
                    <Row>
                      <Col lg={4}>
                        <div className="mb-3">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter Name"
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-3">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter Email"
                          />
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-3">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter Password"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <div className="mb-3">
                          <label htmlFor="subject">Subject</label>
                          <textarea
                            className="form-control"
                            id="subject"
                            rows="3"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <div className="text-right">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </ModalBody>
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(UiLightbox)
