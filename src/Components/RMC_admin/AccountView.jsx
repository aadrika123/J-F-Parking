import { Formik } from 'formik';
import React, { useState } from 'react'

const AccountView = () => {
    const [toggle, setToggle] = useState(false)

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

    return (
      <div className="w-full">
        <div className="p-4">
          <h4 className="font-bold text-lg mb-4">
            In Charge Collection Details
          </h4>
          <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="w-full bg-white p-4 rounded-lg shadow-sm">
              <p className="mb-2 text-gray-700 font-medium">
                Collector Name:<span className="font-bold"> ADV JSK</span>
              </p>
              <p className="mb-2 text-gray-700 font-medium">
                Transaction Date:<span className="font-bold">15-07-2024</span>
              </p>
              <p className="mb-2 text-gray-700 font-medium">
                Total Amount:<span className="font-bold"> 2,850.00</span>
              </p>
              <p className="text-gray-700 font-medium">
                Number of Transactions:<span className="font-bold"> 2</span>
              </p>
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold mr-3 text-3xl">₹ 2830.00 </span>
              Cash
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold mr-3 text-3xl">₹ 4830.00 </span>
              QR Code
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold mr-3 text-3xl">₹ 1830.00 </span>
              DD
            </div>
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
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Conductor ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Schedule Time Range
                </th>
                <th scope="col" class="px-6 py-3">
                  Bus No for the Day
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200 dark:border-gray-700 border">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  TRN 324234234234
                </th>
                <td class="px-6 py-4">Cash</td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">ID32423</td>
                <td class="px-6 py-4">Ram</td>
                <td class="px-6 py-4 bg-gray-50 dark:bg-gray-800">12:00</td>
                <td class="px-6 py-4">JH34B3433</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex justify-between">
            <div className="p-3">
              <button
                type="button"
                onClick={handleClick}
                class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Comment
              </button>
            </div>

            <div className="p-3">
              <button
                type="button"
                class="text-white bg-[#3335c9]  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Disputed
              </button>

              <button
                type="button"
                class="text-white bg-[#5457D6] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Verify
              </button>

              <button
                type="button"
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Close
              </button>
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
    );
}

export default AccountView