import { useEffect } from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon, WrenchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getInvoiceApi } from '../api/bookingApi';
import useAxiosWithToken from '../hooks/useAxiosWithToken';
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { useRef } from 'react';


const Invoice = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.role && auth?.role !== "Customer") {
            navigate("/");
        }
    }, [auth?.role]);

    const axiosWithToken = useAxiosWithToken();

    const { data: invoiceData, isLoading: invoiceDataLoading, isError: invoiceDataIsError, error: invoiceDataError } = useQuery({
        queryKey: ['Invoice'],
        queryFn: () => getInvoiceApi({ axiosWithToken, id }),
    }
    );

    let totalBill = 0;

    if (invoiceData?.data?.bill?.length > 0) {
        totalBill = invoiceData?.data?.bill?.map(item => item.repairCost)?.reduce((sum, cost) => sum + cost, 0);
    }

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "invoice",
        pageStyle: `
            @page {
            size: A4;
            margin: 0mm;
            }
            @media print {
            html, body {
                height: 100vh;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                -webkit-print-color-adjust: exact;
            }
            
            body > * {
                margin: auto;
            }
            }
        `
    });

    return (
        <>
            <Header />
            <main className='grow  py-12'>
                <div className="px-4 py-4 sm:px-6 flex flex-wrap gap-4 justify-end">
                    <button
                        type="button"
                        className="inline-flex items-center ps-2 cursor-pointer py-2 border text-center border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent hover:opacity-75" onClick={handlePrint}
                        disabled={invoiceDataLoading || !invoiceData?.data}
                        aria-label='Download invoice'
                    >
                        <DownloadIcon className="h-5 w-5 mr-2" /></button>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden sm:rounded-lg shadow-[5px_5px_10px_1px_#cdcdcd]" id='invoice' ref={componentRef}>
                        {/* Invoice Header */}
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Invoice #{id}
                                </h2>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    {invoiceData?.data?.paymentDate && format(invoiceData?.data?.paymentDate, 'dd MMM yyyy')}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm">
                                    Paid
                                </span>
                            </div>
                        </div>
                        {/* Invoice Content */}
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Info */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <WrenchIcon className="h-8 w-8 text-accent mr-2" />
                                        <span className="text-xl font-bold text-gray-800">
                                            DriveWell Garage
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{invoiceData?.data?.branch?.branchName}</p>
                                    <p className="text-sm text-gray-600">{invoiceData?.data?.branch?.branchId?.location}</p>
                                    <p className="text-sm text-gray-600">{invoiceData?.data?.branch?.branchId?.phone}</p>
                                    <p className="text-sm text-gray-600">ashikbiju2000@gmail.com</p>
                                </div>
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Bill To:
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {invoiceData?.data?.customer?.fullName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {invoiceData?.data?.customer?.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {invoiceData?.data?.customer?.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-gray-500">Vehicle:</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {invoiceData?.data?.vehicle?.vehicleName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {invoiceData?.data?.vehicle?.vehicleId?.plate}
                                </p>
                            </div>
                            {/* Invoice Items */}
                            <div className="mt-8 flex flex-col">
                                <div className="mx-4 rounded-lg md:ring-0 ring-1 ring-dim ring-opacity-5 overflow-x-auto">
                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                        <div className="shadow md:rounded-lg px-4 md:ring-1 ring-dim ring-opacity-5">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                        >
                                                            Description
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                                        >
                                                            Price
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {invoiceData?.data?.bill?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {item.repairName}
                                                            </td>


                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right -translate-x-2">
                                                                ${item.repairCost}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Invoice Totals */}
                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <div className="flex justify-end">
                                    <div className="w-full md:w-1/2">
                                        <div className="flex justify-between py-2">
                                            <div className="text-base font-medium text-gray-900">
                                                Total
                                            </div>
                                            <div className="text-base font-medium">
                                                ${totalBill}
                                            </div>
                                        </div>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Payment Method: {invoiceData?.data?.paymentMethod}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Notes */}
                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-sm font-medium text-gray-500">Notes:</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Thank you for choosing DriveWell Garage for your automotive
                                    needs. We appreciate your business!
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                    All services come with a 90-day warranty on parts and labor.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            to={"/dashboard/bookings"}
                            className="text-accent hover:opacity-75 font-semibold"
                        >
                            Back to Bookings
                        </Link>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    )
}

export default Invoice