import { Link } from "react-router-dom"
import Service from "../components/Service"
import { services } from "../constants/carServices"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons"
import ClusterMap from "../components/ClusterMap"
import { branches } from "../constants/branches"
import { Clock4, MapPin, Phone } from "lucide-react"
import { useGetServicesQuery } from "../redux/slices/servicesApi"

const Home = () => {

    // const { data:servicesDetails, error: servicesError, isLoading: servicesLoading } = useGetServicesQuery(); 

    return (
        <main className="grow">
            <section className="bg-box block grid-cols-2 md:grid gap-4 px-4 py-10 text-white">
                <div className="my-auto">
                    <h1 className="font-extrabold text-5xl">Keeping Your Ride in <br className="hidden xs:block md:hidden lg:block" />Top Shape</h1>
                    <p className="mt-8 md:mt-4 lg:mt-8 text-dim text-xl">Professional auto repair and maintenance <br className="hidden xs:block md:hidden lg:block" />services you can trust.</p>
                    <div className="flex">
                        <Link to={"/booking"} className="bg-white text-black font-semibold px-6 py-2 hover:opacity-75 mt-8 md:mt-4 lg:mt-8 rounded-md me-3 w-fit" >Book Now</Link>
                        <Link to={"/services"} className="bg-accent text-white font-semibold px-6 py-2 hover:opacity-75 mt-8 md:mt-4 lg:mt-8 rounded-md me-3 w-fit">Our Services</Link>
                    </div>
                </div>
                <img src="/landing1.jpg" alt="Automobile" className="hidden md:block w-[500px] aspect-3/2 object-cover m-auto" />
            </section>
            <section className="px-4 py-10">
                <h2 className="mt-4 text-center font-bold text-4xl">Our Services</h2>
                <p className="text-center text-lg mt-3 text-dim-black">Professional auto repair services for all makes and models</p>
                <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
                    {
                        services?.filter(service => service.id < 5).map(service => {
                            return <Service key={service.id} service={service} />
                        })
                    }
                </div>
                <Link to={"/services"} className="mt-12 bg-accent px-4 py-3 rounded-md mx-auto hover:opacity-75 font-semibold w-fit text-white block">View All Services <FontAwesomeIcon icon={faArrowRight} /></Link>
            </section>
            <section className="mt-10 text-center px-4 py-6 flex gap-8 items-center flex-wrap justify-center">
                <div className="bg-blue-100 w-full sm:w-[280px] px-4 py-10">
                    <Clock4 className="text-2xl text-accent mx-auto" />
                    <h4 className="font-bold text-xl mt-2">Opening Hours</h4>
                    <p className="text-dim-black mt-3">Monday - Friday: 8AM - 6PM</p>
                    <p className="text-dim-black">Saturday: 9AM - 4PM</p>
                    <p className="text-dim-black">Sunday: Closed</p>
                </div>
                <div className="bg-blue-100 w-full sm:w-[280px] px-4 py-10">
                    <Phone className="text-2xl text-accent mx-auto" />
                    <h4 className="font-bold text-xl mt-2">Contact Info</h4>
                    <p className="text-dim-black mt-3">Phone: +91-9747991662</p>
                    <p className="text-dim-black">Landline: 0484-2244265</p>
                    <p className="text-dim-black">Email: ashikbiju2000@gmail.com</p>
                </div>
                <div className="bg-blue-100 w-full sm:w-[280px] px-4 py-10">
                    <MapPin className="text-2xl text-accent mx-auto" />
                    <h4 className="font-bold text-xl mt-2">Main Location</h4>
                    <p className="text-dim-black mt-3">Piravom, Kerala</p>
                    <p className="text-dim-black">India, 686664</p>
                    <Link to={"/contact"} className="text-accent font-semibold hover:underline" >View All Locations</Link>
                </div>
            </section>
            <section className="px-4 py-10">
                <h2 className="mt-4 text-center font-bold text-4xl">Our Branches</h2>
                <p className="text-center text-lg mt-3 text-dim-black">Find the DriveWell Garage location nearest to you</p>
                <ClusterMap />
                <Link to={"/contact"} className="mt-12 w-fit bg-accent px-4 py-3 rounded-md mx-auto hover:opacity-75 font-semibold text-white block">View All Branches <FontAwesomeIcon icon={faArrowRight} /></Link>
            </section>
        </main>
    )
}

export default Home