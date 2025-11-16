import Branch from "../components/Branch"
import ClusterMap from "../components/ClusterMap"
import { branches } from "../constants/branches"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { handleChange } from "../helpers/formHelper";
import { getAllBranchesApi } from "../api/branchApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Contact = () => {

    const [mailContent, setMailContent] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const { data: allBranches, isLoading: allBranchesLoading, isError: allBranchesIsError, error: allBranchesError } = useQuery({
        queryKey: ['Branch'],
        queryFn: () => getAllBranchesApi(),
        select: response => response?.data?.sort((a, b) => (b._id - a._id)),
    }
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="grow px-4 py-6 rounded-md" id="Contact">
            <h2 className="mt-4 text-center font-bold text-4xl">Contact Us</h2>
            <p className="text-center text-lg mt-3 text-dim-black">Have questions or need assistance? Reach out to our team or visit one of our locations.</p>
            <section id="branches">
                <h3 className="mt-18 font-bold text-3xl">Our Branches</h3>
                {
                    allBranches?.length > 0 ?
                        <ClusterMap allBranches={allBranches} /> :
                        <p className='mt-3 text-dim-black'>No branches available yet.</p>
                }
            </section>
            {
                allBranches?.length > 0 &&
                <section>
                    <h3 className="mt-18 font-bold text-3xl">Find a Location</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 mt-6">
                        {
                            allBranches?.map((branch) => (
                                <Branch key={branch?._id} branch={branch} />
                            ))
                        }
                    </div>
                </section>}
            <section>
                <h3 className="mt-18 font-bold text-3xl">About DriveWell Garage</h3>
                <p className="mt-1 text-dim-black text-md">Providing quality auto repair services since 2005.</p>
                <div className="w-full lg:w-[90%]">
                    <p className="mt-3">DriveWell Garage is a full-service auto repair and maintenance center with multiple locations across the city. Our team of certified technicians is dedicated to providing exceptional service and keeping your vehicle in top condition.We pride ourselves on honest, transparent service and fair pricing. From routine maintenance to complex repairs, our team has the expertise and equipment to handle all your automotive needs.All of our locations offer a comfortable waiting area with complimentary Wi-Fi, coffee, and refreshments. Many of our branches also provide courtesy shuttle service or loaner vehicles for your convenience.</p>
                </div>

            </section>
            <section>
                <h3 className="mt-18 font-bold text-3xl">Send Us a Message</h3>
                <p className="mt-1 text-dim-black text-md">We'll get back to you as soon as possible.</p>
                <form className="w-full shadow-[5px_5px_10px_1px_#cdcdcd] px-15 py-10 mt-8">
                    <TextField id="name" name='name' variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setMailContent)} value={mailContent.name} label="Name" sx={{ mt: 3 }} required />
                    <TextField id="email" name='email' variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setMailContent)} value={mailContent.email} label="Email" sx={{ mt: 3 }} required />
                    <TextField id="phone" name='phone' variant="outlined" type="tel" className='w-full' onChange={(e) => handleChange(e, setMailContent)} value={mailContent.phone} label="Phone Number" sx={{ mt: 3 }} required />
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="service" required>Select a Subject</InputLabel>
                        <Select
                            labelId="subject"
                            id="subject"
                            name='subject'
                            value={mailContent.subject}
                            label="Select a subject"
                            onChange={(e) => handleChange(e, setMailContent)}
                            required
                        >
                            <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                            <MenuItem value="Servuce Question">Servuce Question</MenuItem>
                            <MenuItem value="Appointment Request">Appointment Request</MenuItem>
                            <MenuItem value="Feedback">Feedback</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField id="message" name='message' variant="outlined" label="Message" type="text" multiline onChange={(e) => handleChange(e, setMailContent)} value={mailContent.message} fullWidth sx={{ mt: 3 }} rows={4} required />
                    <button type='submit' className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer'>Book Appoinment</button>
                </form>
            </section>
            <div className="bg-box mt-8 rounded-md shadow flex-col flex md:flex-row h-[300px] justify-center md:justify-start md:items-center px-10 py-12 gap-8">
                <div className="text-white">
                    <h4 className="font-bold text-xl">Get in Touch</h4>
                    <p className="text-dim mt-1">Contact us directly through any of the following methods:</p>
                    <p className="text-dim mt-4"><FontAwesomeIcon icon={faPhone} /> +91-9747991662</p>
                    <p className="text-dim mt-2"><FontAwesomeIcon icon={faEnvelope} /> ashikbiju2000@gmail.com</p>
                    <div className="flex gap-2 mt-2 text-dim"><FontAwesomeIcon icon={faComment} className="mt-2" /><p> Live Chat Available <br />Mon-Fri: 8AM-6PM</p></div>
                </div>
            </div>

        </main>
    )
}

export default Contact