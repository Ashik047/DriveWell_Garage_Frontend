import { faClock, faEnvelope, faLocationPin, faPhone, faWrench } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import "./Footer.css"
import { WrenchIcon } from "lucide-react"

const Footer = () => {
    return (
        <footer className="p-6 bg-secondary" id="Footer">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <h4><WrenchIcon className='text-accent me-2 inline transform -translate-y-0.5' size={17} />DriveWell Garage</h4>
                    <p className="mt-3">Keeping Your Ride in Top Shape</p>
                </div>
                <div className="mt-6 sm:mt-0">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to={"/"} className="cursor-pointer" > Home</Link></li>
                        <li><Link to={"/services"} className="cursor-pointer" > Services</Link></li>
                        <li><Link to={"/booking"} className="cursor-pointer" > Book Appoinment</Link></li>
                        <li><Link to={"/contact"} className="cursor-pointer" > Contact Us</Link></li>
                    </ul>
                </div>
                <div className="mt-6 md:mt-0">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:919747991662" target="_blank"><FontAwesomeIcon icon={faPhone} className="me-2" />+91-9747991662</a></li>
                        <li><a href="mailto:ashikbiju2000@gmail.com" target="_blank"><FontAwesomeIcon icon={faEnvelope} className="me-2" />ashikbiju2000@gmail.com</a></li>
                        <li><FontAwesomeIcon icon={faLocationPin} className="me-2" />Piravom, Kerala <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;India 686664</li>
                        <li><FontAwesomeIcon icon={faClock} className="me-2" />Mon-Fri: 8AM-6PM,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sat: 9AM-4PM</li>
                    </ul>
                </div>
                <div className="mt-6 md:mt-0">
                    <h4>Follow Us</h4>
                    <div className="mt-3 text-dim">
                        <a href="#" target="_blank"><FontAwesomeIcon icon={faFacebook} className="me-2" /></a>
                        <a href="#" target="_blank"><FontAwesomeIcon icon={faInstagram} className="me-2" /></a>
                        <a href="#" target="_blank"><FontAwesomeIcon icon={faTwitter} className="me-2" /></a>
                    </div>
                </div>
            </div>
            <hr className="mt-5 text-dim opacity-25" />
            <p className="mt-5">&copy; 2025 DriveWell Garage. All rights reserved.</p>
        </footer>
    )
}

export default Footer