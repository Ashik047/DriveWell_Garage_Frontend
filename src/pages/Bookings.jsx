import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { handleChange } from '../helpers/formHelper';


const Bookings = () => {
    const [bookingData, setBookingData] = useState({
        vehicle: "",
        service: "",
        date: "",
        time: "",
        description: ""
    });

    return (
        <main className="grow px-4 py-6 rounded-md">
            <h2 className="mt-4 text-center font-bold text-4xl">Book Your Service</h2>
            <p className="text-center text-lg mt-3 text-dim-black">Schedule an appointment with our expert mechanics</p>
            <form className="w-full shadow-[5px_5px_10px_1px_#cdcdcd] px-15 py-10 mt-8">
                <FormControl fullWidth>
                    <InputLabel id="vehicle" required>Select Your Vehicle</InputLabel>
                    <Select
                        labelId="vehicle"
                        id="vehicle"
                        name='vehicle'
                        value={bookingData.vehicle}
                        label="Select Your Vehicle"
                        onChange={(e) => handleChange(e, setBookingData)}
                        required
                    >
                        <MenuItem value="crysta">Innova Crysta</MenuItem>
                        <MenuItem value="polo">Volkswagen Polo</MenuItem>
                    </Select>


                </FormControl>
                <FormControl fullWidth sx={{ mt: 3 }}>
                    <InputLabel id="service" required>Select Service</InputLabel>
                    <Select
                        labelId="service"
                        id="service"
                        name='service'
                        value={bookingData.service}
                        label="Select Service"
                        onChange={(e) => handleChange(e, setBookingData)}
                        required
                    >
                        <MenuItem value="oil">Oil Change</MenuItem>
                        <MenuItem value="engine">Engine Diagnostics</MenuItem>
                        <MenuItem value="tire">Tire Replacement</MenuItem>
                        <MenuItem value="battery">Battery Service</MenuItem>
                        <MenuItem value="brake">Brake Service</MenuItem>
                        <MenuItem value="ac">Air Conditioning</MenuItem>
                        <MenuItem value="computer">Computer Systems</MenuItem>
                        <MenuItem value="detailing">Detailing Services</MenuItem>
                        <MenuItem value="general">General Maintenance</MenuItem>
                        <MenuItem value="transmission">Transmission Service</MenuItem>
                    </Select>
                </FormControl>
                <div className='flex gap-4 mt-6'>
                    <TextField id="date" name='date' variant="outlined" type="date" className='grow' onChange={(e) => handleChange(e, setBookingData)} value={bookingData.date} required />
                    <TextField id="time" name='time' variant="outlined" type="time" className='grow' onChange={(e) => handleChange(e, setBookingData)} value={bookingData.time} required />
                </div>
                <TextField id="description" name='description' variant="outlined" label="Describe the issue" type="text" multiline onChange={(e) => handleChange(e, setBookingData)} value={bookingData.description} fullWidth sx={{ mt: 3 }} rows={4} required />
                <button type='submit' className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer'>Book Appoinment</button>
            </form>
            <p className='mt-12 mb-6 text-center text-dim-black'>Need help? Contact us at <a href="tel:+919747991662" className='text-accent'>+91-9747991662</a></p>
        </main >
    )
}

export default Bookings