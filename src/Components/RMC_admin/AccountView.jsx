import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

const AccountView = () => {
  const [toggle, setToggle] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({})
  const { id } = useParams()
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  //for mui dialog====================
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };
  //for mui dialog=====================

  const handleClick = () => {
    console.log('Button clicked');
    setToggle(true)
  }

  const handleClose = () => {
    setToggle(false);
  }

  const initialValues = {
    comment: '',
  }

  const handleSave = (values) => {
    console.log('Save button clicked', values);
  }

  const verify = async (transaction_id) => {
    try {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/summary/verify`,
          {
            transaction_id: transaction_id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        .then((res) => {
          if (res?.data?.status) {
            alert('Verified successfully')
            navigate('/accountant')
          } else {
            alert('Verified failed')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const getSummaryDetails = async () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/summary/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res?.data?.data, 'summaryDetails');
          setData(res?.data?.data)
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSummaryDetails()
  }, [])

  const totalAmount = data?.receipts?.reduce((sum, item) => {
    return sum + item?.amount
  }, 0)


  // const cashReceipts = data?.receipts?.filter((item) => item?.payment_mode === 'cash')

  // const cashAmount = cashReceipts?.reduce((sum, item) => {
  //   return sum + item?.amount
  // }, 0)

  const cashReceipts = data?.accounts_summary?.filter((item) => item?.transaction_type === 'cash')

  const cashAmount = cashReceipts?.reduce((sum, item) => {
    return sum + item?.total_amount
  }, 0)

  const qrReceipts = data?.receipts?.filter((item) => item?.payment_mode === 'qr')
  const qrAmount = qrReceipts?.reduce((sum, item) => {
    return sum + item?.amount
  }, 0)

  const VerifyDialog = ({ receiptData }) => {
    const totalAmount = receiptData?.reduce((sum, item) => sum + item?.amount, 0)
    const transaction_id = [...new Set(data?.accounts_summary?.map(item => item?.transaction_id))];
    return (
      <Dialog
        fullWidth
        maxWidth='xl'
        open={open}
        onClose={handleClickClose}
      >
        <DialogTitle>Receipts</DialogTitle>
        <DialogContent>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Receipt No.</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">In Time</TableCell>
                  <TableCell align="right">Out Time</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Vehicle Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receiptData?.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.receipt_no}
                    </TableCell>
                    <TableCell align="right">{item?.amount}</TableCell>
                    <TableCell align="right">{item?.in_time}</TableCell>
                    <TableCell align="right">{item?.out_time}</TableCell>
                    <TableCell align="right">{new Date(item?.date).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{item?.vehicle_type === 'two_wheeler' ? 'Two Wheeler' : item?.vehicle_type === 'four_wheeler' ? 'Four Wheeler' : 'N/A'}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className='border-2'
                >
                  <TableCell component="th" scope="row">
                    {''}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 'large', fontWeight: 700 }}>Total: {totalAmount}</TableCell>
                  <TableCell align="right">{''}</TableCell>
                  <TableCell align="right">{''}</TableCell>
                  <TableCell align="right">{''}</TableCell>
                  <TableCell align="right">{''}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => { handleClickClose(); verify(transaction_id) }}>Verify</Button>
        </DialogActions>
      </Dialog>
    )
  }


  return (
    <>
      <VerifyDialog receiptData={data?.receipts} />
      <div className="w-full">
        <div className="p-4">
          <h4 className="font-bold text-lg mb-4">
            In Charge Collection Details
          </h4>
          <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="w-full bg-white p-4 rounded-lg shadow-sm">
              <p className="mb-2 text-gray-700 font-medium">
                Collector Name:<span className="font-bold">{data?.incharge?.map((item, index) => ` ${item?.first_name} ${item?.last_name}${(data?.incharge?.length - 1) !== index ? ', ' : ''} `)}</span>
              </p>
              {/* <p className="mb-2 text-gray-700 font-medium">
              Transaction Date:<span className="font-bold">15-07-2024</span>
            </p> */}
              <p className="mb-2 text-gray-700 font-medium">
                Total Amount:<span className="font-bold"> {cashAmount}</span>
              </p>
              <p className="text-gray-700 font-medium">
                Number of Transactions:<span className="font-bold"> {data?.accounts_summary?.length}</span>
              </p>
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold mr-3 text-3xl"> ₹{cashAmount} </span>
              Cash
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold mr-3 text-3xl"> ₹{qrAmount}  </span>
              QR Code
            </div>
            {/* <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
            <span className="font-bold mr-3 text-3xl">₹ 1830.00 </span>
            DD
          </div> */}
          </div>
        </div>

        <div class="relative overflow-x-auto shadow-md ml-4 mr-4">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase dark:text-gray-400 border">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Transaction No.
                </th>
                <th scope="col" class="px-6 py-3 ">
                  Payment Mode
                </th>
                <th scope="col" class="px-6 py-3 ">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Incharge ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Schedule Time Range
                </th>
                <th scope="col" class="px-6 py-3">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.accounts_summary?.map((item, index) => (
                <tr key={index} class="border-b border-gray-200 dark:border-gray-700 border">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    {item?.transaction_id}
                  </th>
                  <td class="px-6 py-4">{item?.transaction_type}</td>
                  <td class="px-6 py-4">{item?.total_amount}</td>
                  <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">{item?.incharge_id}</td>
                  <td class="px-6 py-4">{item?.incharge?.first_name} {item?.incharge?.last_name}</td>
                  <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">{`${data?.from_time} - ${data?.to_time}`}</td>
                  <td class="px-6 py-4">{`${item?.area?.address} - ${item?.area?.station} (zip/Code: ${item?.area?.zip_code})`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between">
            <div className="p-3">
              {/* <button
              type="button"
              onClick={handleClick}
              class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Comment
            </button> */}
            </div>

            <div className="p-3">
              {/* <button
              type="button"
              class="text-white bg-[#3335c9]  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Disputed
            </button> */}

              <button
                type="button"
                class="text-white bg-[#5457D6] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={handleClickOpen}
              >
                Verify
              </button>

              {/* <button
              type="button"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Close
            </button> */}
            </div>
          </div>

          {toggle && (
            <>
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl h-auto space-y-8 transform transition-transform duration-300 ease-out scale-95">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1.4 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      X
                    </button>
                  </div>

                  <div className="">
                    <Formik initialValues={initialValues} onSubmit={handleSave}>
                      {({ values, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="relative">
                          {/* ------------------------------------------------------- */}
                          <div>
                            <label className="font-bold">Comment</label>
                            <br></br>
                            <textarea
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.comment}
                              name="comment"
                              placeholder="Your Comment ....."
                              maxLength={200}
                              rows={4}
                              className="border p-2 w-full mt-3 resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-end mt-5 gap-5">
                            <button
                              buttonType="submit"
                              variant="primary"
                              className="bg-[#5457D6] text-white p-2 rounded-md w-[5rem]"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AccountView