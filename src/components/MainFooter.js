const MainFooter = () => {
    return (
      <div className="bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-6 col-md-6">
              <h5 className="text-white mb-4">Get In Touch</h5>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                123 Street, New York, USA
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                +012 345 67890
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                info@example.com
              </p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="#">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-outline-light btn-social" href="#">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-outline-light btn-social" href="#">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
  
            <div className="col-lg-6 col-md-6">
              <h5 className="text-white mb-4">Quick Links</h5>
              <a className="btn btn-link text-white-50" href="#">
                About Us
              </a>
              <a className="btn btn-link text-white-50" href="#">
                Contact Us
              </a>
              <a className="btn btn-link text-white-50" href="#">
                Privacy Policy
              </a>
              <a className="btn btn-link text-white-50" href="#">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
  
        <div className="container">
          <div className="copyright text-center py-4">
            <p className="mb-0">
              © <a href="#" className="text-white">Real Estate</a>, All Rights Reserved.
            </p>
          </div>
        </div>
  
        <a
          href="#"
          className="btn btn-lg btn-lg-square back-to-top"
          style={{ backgroundColor: '#C9184A', color: 'white' }}
        >
          <i className="bi bi-arrow-up" />
        </a>
      </div>
    );
  };
  
  export default MainFooter;