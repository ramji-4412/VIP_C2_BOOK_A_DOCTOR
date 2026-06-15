import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "./Home.css";

const Home = () => {
  return (
    <div className="arogya-root">
      {/* ── NAVBAR ── */}
      <Navbar expand="lg" className="arogya-navbar" sticky="top">
        <Container>
          <Navbar.Brand href="#home" className="arogya-brand">
            <span className="brand-icon">✚</span>
            ArogyaMitra
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              <Nav.Link href="#home" className="nav-link-custom active">
                Home
              </Nav.Link>
              <Nav.Link href="#login" className="nav-link-custom">
                Login
              </Nav.Link>
              <Button
                href="#register"
                className="btn-register-nav ms-lg-2"
                size="sm"
              >
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── HERO ── */}
      <section className="hero-section" id="home">
        <div className="hero-bg-blur" />
        <Container className="hero-container">
          <Row className="align-items-center gy-5">
            <Col lg={6} className="hero-text">
              <p className="hero-eyebrow">Trusted Healthcare, Within Reach</p>
              <h1 className="hero-heading">
                Book Doctor Appointments <span className="accent-word">Easily</span>
              </h1>
              <p className="hero-sub">
                ArogyaMitra connects you with verified doctors across
                specialities — from your home, in minutes. Your health records
                stay safe, your reminders arrive on time, and your care never
                slips through the cracks.
              </p>
              <div className="hero-actions">
                <Button href="#login" className="btn-primary-custom me-3">
                  Login
                </Button>
                <Button href="#register" className="btn-outline-custom">
                  Register
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-visual-col d-none d-lg-flex">
              <div className="hero-card-stack">
                <div className="floating-card card-a">
                  <span className="card-icon">🩺</span>
                  <div>
                    <p className="fc-label">Next Appointment</p>
                    <p className="fc-value">Dr. Sharma · 10:30 AM</p>
                  </div>
                </div>
                <div className="floating-card card-b">
                  <span className="card-icon">✅</span>
                  <div>
                    <p className="fc-label">Booking Confirmed</p>
                    <p className="fc-value">Cardiology · Today</p>
                  </div>
                </div>
                <div className="hero-blob" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <Container>
          <div className="section-header text-center mb-5">
            <p className="section-eyebrow">Why ArogyaMitra</p>
            <h2 className="section-heading">
              Everything you need in one place
            </h2>
          </div>
          <Row className="gy-4">
            {features.map((f, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="feature-card h-100">
                  <Card.Body className="d-flex flex-column align-items-start">
                    <div className="feature-icon-wrap">{f.icon}</div>
                    <Card.Title className="feature-title">{f.title}</Card.Title>
                    <Card.Text className="feature-text">{f.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-section" id="about">
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={5}>
              <div className="about-badge-group">
                <div className="about-stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Specialities</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Patients Served</span>
                </div>
                <div className="about-stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Verified Doctors</span>
                </div>
              </div>
            </Col>
            <Col lg={6} className="offset-lg-1">
              <p className="section-eyebrow">About ArogyaMitra</p>
              <h2 className="section-heading">
                Healthcare that understands you
              </h2>
              <p className="about-text">
                ArogyaMitra — meaning "Health Friend" in Sanskrit — was built
                on a simple belief: quality healthcare should never be a
                privilege. We bring together a curated network of verified
                doctors, a secure platform for your medical records, and
                intelligent appointment reminders so you can focus on
                recovering, not chasing paperwork.
              </p>
              <p className="about-text">
                Whether you are booking a routine check-up in Lucknow or
                consulting a specialist across the country, ArogyaMitra is the
                companion that stays with you at every step of your health
                journey.
              </p>
              <Button href="#register" className="btn-primary-custom mt-3">
                Get Started Free
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── FOOTER ── */}
      <footer className="arogya-footer">
        <Container>
          <Row className="gy-4 align-items-start">
            <Col md={4}>
              <p className="footer-brand">
                <span className="brand-icon">✚</span> ArogyaMitra
              </p>
              <p className="footer-tagline">
                Your trusted companion for smarter, simpler healthcare.
              </p>
            </Col>
            <Col md={2} xs={6}>
              <p className="footer-col-head">Platform</p>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </Col>
            <Col md={2} xs={6}>
              <p className="footer-col-head">Account</p>
              <ul className="footer-links">
                <li><a href="#login">Login</a></li>
                <li><a href="#register">Register</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <p className="footer-col-head">Contact</p>
              <p className="footer-contact">support@arogyamitra.in</p>
              <p className="footer-contact">+91 98765 43210</p>
            </Col>
          </Row>
          <hr className="footer-divider" />
          <p className="footer-copy text-center">
            © {new Date().getFullYear()} ArogyaMitra. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

/* ── Feature data ── */
const features = [
  {
    icon: "📅",
    title: "Easy Appointment Booking",
    desc: "Browse available slots and confirm your visit in under two minutes — no phone calls, no waiting on hold.",
  },
  {
    icon: "🩺",
    title: "Verified Doctors",
    desc: "Every doctor on ArogyaMitra is credential-verified. Read real patient reviews before you decide.",
  },
  {
    icon: "🔒",
    title: "Secure Medical Records",
    desc: "Your prescriptions, reports, and history are encrypted and available to you anytime, anywhere.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    desc: "Timely reminders for upcoming appointments and medication schedules, delivered your way.",
  },
];

export default Home;
