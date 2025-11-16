import { useQuery } from "@tanstack/react-query";
import { getAllServicesApi } from "../api/serviceApi";
import Service from "../components/Service"
import { services } from "../constants/carServices"

const Services = () => {

    const { data: allServices, isLoading: allServicesLoading, isError: allServicesIsError, error: allServicesError } = useQuery({
        queryKey: ['Service'],
        queryFn: () => getAllServicesApi(),
        select: response => response?.data?.sort((a, b) => (b._id - a._id)),
    }
    );

    return (
        <main className="grow px-4 py-6">
            <h2 className="mt-4 text-center font-bold text-4xl">Our Services</h2>
            <p className="text-center text-lg mt-3 text-dim-black">Professional auto repair and maintenance services for all makes and models. Our certified technicians use the latest tools and technology.</p>
            {
                allServices?.length > 0 ?
                    <div className="mt-13 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
                        {
                            allServices?.map(service => {
                                return <Service key={service?._id} service={service} />
                            })
                        }
                    </div> :
                    <>
                        <p className='mt-10 text-dim-black text-center'>No services available yet.</p>
                        <img src="/empty.gif" alt="Empty" className='w-[300px] block mx-auto' />
                    </>
            }
            <div className="bg-box mt-8 rounded-md shadow flex-col flex md:flex-row h-[200px] justify-center md:justify-start md:items-center px-10 py-6 gap-8">
                <div className="text-white">
                    <h4 className="font-bold text-xl">Need a custom service?</h4>
                    <p className="text-dim mt-2">Contact us for specialized repair needs or to discuss your vehicle's requirements.</p>
                </div>
                <div className="md:ms-auto me-10"><a className="bg-white rounded-md px-4 py-3 my-auto hover:opacity-75" href=" tel:+919747991662">Request&nbsp;Customer&nbsp;Service</a></div>
            </div>

        </main >
    )
}

export default Services