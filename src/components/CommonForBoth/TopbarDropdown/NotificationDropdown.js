import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import { connect } from "react-redux"
import { withTranslation } from "react-i18next"

const NotificationDropdown = props => {
  const [menu, setMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (props.notifications) {
      const count = Object.keys(props.notifications).length
      setNotificationCount(count)
    }
  }, [props.notifications])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block ms-1"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon waves-effect"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="ti-bell"></i>
          {notificationCount > 0 && (
            <span className="badge text-bg-danger rounded-pill">{notificationCount}</span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h5 className="m-0"> {props.t("Notifications")} ({notificationCount}) </h5>
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notificationCount > 0 ? (
              Object.values(props.notifications).map((notification, index) => (
                <div key={index} className="p-3 border-bottom" style={{ backgroundColor: '#fff9e6' }}>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Action Required</h6>
                      <div className="font-size-13 text-muted">
                        <p className="mb-1">
                          Remove product "{notification.productName}" from marketplace: {notification.listedMarketplaces}.
                          This product is marked as Sold in {notification.soldMarketplace}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center">
                <p className="text-muted mb-0">{props.t("No new notifications")}</p>
              </div>
            )}
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="#"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {" "}
              {props.t("View all")}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  notifications: state.Notification?.notifications || {}
});

export default connect(mapStateToProps)(withTranslation()(NotificationDropdown))

NotificationDropdown.propTypes = {
  t: PropTypes.any,
  notifications: PropTypes.object
}