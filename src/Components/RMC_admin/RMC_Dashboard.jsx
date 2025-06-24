import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { TurnLeftOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import toast, { Toaster } from "react-hot-toast";
import createApiInstance from "../../AxiosInstance";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';





// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
// import { FaCalendarAlt } from "react-icons/fa"

const yearlyTotal = 500000; // Replace with your calculated total
const weeklyTotal = 80000;
const datewiseTotal = 23000;

export default function RMC_Dashboard() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [val, setVal] = useState([]);
  const [series, setSeries] = useState([]);
  const [axis, setXaxis] = useState([]);
  const [pie, setPie] = useState({ UnOrganized: [], Organized: [] });
  const [count, setCount] = useState({ two_wheeler: [], four_wheeler: [] });

  const [fromDates, setFromDates] = useState(new Date());
  const [toDates, setToDates] = useState(new Date());
  const [counts, setCounts] = useState({ two_wheeler: [], four_wheeler: [] });

  const [nfromDates, setNFromDates] = useState(new Date());
  const [ntoDates, setNToDates] = useState(new Date());

  const [hourlyRealTimeData, setHourlyRealTimeData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const categories = statisticsData?.map((item) => new Date(item?.date).toISOString().split('T')[0]);

  const totalAmount = statisticsData?.map((item) => item?.total_amount);
  const totalAmountSum = totalAmount?.reduce((sum, item) => sum + item, 0);

  const totalBill = statisticsData?.map((item) => item?.vehicle_count);
  const totalBillSum = totalBill?.reduce((sum, item) => sum + item, 0);
  const token = Cookies.get("accesstoken");



  const [selectedYear, setSelectedYear] = useState(new Date());
  const [weekFrom, setWeekFrom] = useState(new Date());
  const [weekTo, setWeekTo] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const BaseApi = createApiInstance("Base");


  //   const handleApprovalToggle = async () => {
  //   try {


  //     const response = await BaseApi.get(
  //       `/report/yearly`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response)
  //     if (response?.data?.data) {
  //       // setTableData(response.data.data);

  //       toast.success("Data refreshed successfully");
  //     } else {
  //       toast.error("Failed to fetch data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("Something went wrong while fetching the data");
  //   } finally {

  //   }
  // };

  // useEffect(() => {
  //   handleApprovalToggle()
  // }, [])


  const [yearlyData, setYearlyData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchYearlyCollection = async () => {
    try {
      setLoading(true)
      const res = await BaseApi.get("/report/yearly", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = res?.data?.data
      if (!data) throw new Error("No data found")

      const combinedData = [...data.Organized, ...data.UnOrganized]

      // Group by year and sum total_amount
      const yearlyTotals = {}

      combinedData.forEach((item) => {
        const year = new Date(item.date).getFullYear()
        const amount = item.total_amount || 0

        if (yearlyTotals[year]) {
          yearlyTotals[year] += amount
        } else {
          yearlyTotals[year] = amount
        }
      })

      const formatted = Object.entries(yearlyTotals).map(([year, value]) => ({
        year,
        value,
      }))

      setYearlyData(formatted)
      toast.success("Yearly collection loaded")
    } catch (err) {
      console.error("Error loading yearly collection:", err)
      toast.error("Failed to load yearly collection")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchYearlyCollection()
  }, [])


  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const fetchMonthlyCollection = async () => {
    try {
      setLoadingMonth(true);
      const res = await BaseApi.get("/report/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res?.data?.data;
      if (!data) throw new Error("No data found");

      const combinedData = [...data.Organized, ...data.UnOrganized];

      const monthlyTotals = {};

      combinedData.forEach((item) => {
        const date = new Date(item.date);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
        const amount = item.total_amount || 0;

        if (monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] += amount;
        } else {
          monthlyTotals[monthYear] = amount;
        }
      });

      const formatted = Object.entries(monthlyTotals)
        .map(([month, value]) => ({ month, value }))
        .sort((a, b) => {
          // Parse month-year string into actual Date objects to sort correctly
          const parse = (m) => new Date(`1 ${m}`);
          return parse(a.month) - parse(b.month);
        });

      setMonthlyData(formatted);
      toast.success("Monthly collection loaded");
    } catch (err) {
      console.error("Error loading monthly collection:", err);
      toast.error("Failed to load monthly collection");
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    fetchMonthlyCollection();
  }, []);


  // const [weeklyData, setWeeklyData] = useState([]);
  // const [loadingWeek, setLoadingWeek] = useState(false);

  // const fetchWeeklyCollection = async () => {
  //   try {
  //     setLoadingWeek(true);
  //     const res = await BaseApi.get("/report/weekly-collection", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const data = res?.data?.data;
  //     if (!data) throw new Error("No data found");

  //     const combinedData = [...data.Organized, ...data.UnOrganized];

  //     const weeklyTotals = {};

  //     combinedData.forEach((item) => {
  //       const date = new Date(item.date);
  //       const weekStart = new Date(date);
  //       weekStart.setDate(date.getDate() - date.getDay()); // Sunday as week start

  //       const key = weekStart.toLocaleDateString("en-GB", {
  //         day: "2-digit",
  //         month: "short",
  //         year: "numeric",
  //       });

  //       const amount = item.total_amount || 0;

  //       if (weeklyTotals[key]) {
  //         weeklyTotals[key] += amount;
  //       } else {
  //         weeklyTotals[key] = amount;
  //       }
  //     });

  //     const formatted = Object.entries(weeklyTotals)
  //       .map(([week, value]) => ({ week, value }))
  //       .sort((a, b) => new Date(a.week) - new Date(b.week));

  //     setWeeklyData(formatted);
  //     toast.success("Weekly collection loaded");
  //   } catch (err) {
  //     console.error("Error loading weekly collection:", err);
  //     toast.error("Failed to load weekly collection");
  //   } finally {
  //     setLoadingWeek(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchWeeklyCollection();
  // }, []);

  const [selectedMonth, setSelectedMonth] = useState(new Date())
const [weeklyData, setWeeklyData] = useState([])
const [loadingWeek, setLoadingWeek] = useState(false);


  const fetchWeeklyCollection = async () => {
  try {
    setLoadingWeek(true);

    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

    const res = await BaseApi.post(
      "/report/weekly-collection",
      {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = res?.data?.data;
    if (!data) throw new Error("No data found");

    const combinedData = [...data.Organized, ...data.UnOrganized];

    // Build 5 week ranges (W-1 to W-5)
    const weeks = Array.from({ length: 5 }, (_, i) => ({
      week: `W-${i + 1}`,
      value: 0,
    }));

    combinedData.forEach((item) => {
      const date = new Date(item.date);
      const amount = item.total_amount ?? 0;

      if (
        date >= startDate &&
        date <= endDate &&
        !isNaN(date.getTime())
      ) {
        const dayOfMonth = date.getDate();
        const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 4); // Maps to 0-4 → W-1 to W-5
        weeks[weekIndex].value += amount;
      }
    });

    setWeeklyData(weeks);
  } catch (err) {
    console.error("Error loading weekly collection:", err);
    toast.error("Failed to load weekly collection");
    setWeeklyData([
      { week: "W-1", value: 0 },
      { week: "W-2", value: 0 },
      { week: "W-3", value: 0 },
      { week: "W-4", value: 0 },
      { week: "W-5", value: 0 },
    ]);
  } finally {
    setLoadingWeek(false);
  }
};


useEffect(() => {
  fetchWeeklyCollection();
}, [selectedMonth]);




  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const newDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    newDate
  );

  const cookie = Cookies.get("accesstoken");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const dates = count?.two_wheeler
    ?.concat(count?.four_wheeler)
    ?.map((item) => formatDate(item.date));

  const uniqueDates = [...new Set(dates)];

  const formatDates = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const datess = count?.two_wheeler
    ?.concat(counts?.four_wheeler)
    ?.map((item) => formatDates(item.date));

  const uniqueDatess = [...new Set(datess)];

  ////////////////////// api call /////////////////////////////////////////////////////////////////////////////////////

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/report/real-time`,
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      const responseData = response.data.data;
      setVal(responseData);

      const seriesData = responseData?.data?.map((item) => item.sum);
      setSeries(seriesData);

      const x = responseData?.data?.map((item) => item.to);
      setXaxis(x);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /////////////////////////////////////////////////////////////////////////

  const formatDat = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchDatas = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/weekly-collection`,
        {
          from_date: formatDat(nfromDates),
          to_date: formatDat(ntoDates),
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setPie(response.data.data);
    } catch (error) {
      console.error("There was an error onboarding the parking area!", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [nfromDates, ntoDates]);

  /////////////////////////////////////////////////////////////////////////

  const fetchCount = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/vehicle-count`,
        {
          from_date,
          to_date,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setCount(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the vehicle count!", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      const from_date = fromDate.toISOString().split("T")[0];
      const to_date = toDate.toISOString().split("T")[0];
      fetchCount(from_date, to_date);
    }
  }, [fromDate, toDate]);


  useEffect(() => {
    if (fromDates && toDates) {
      const from_date = fromDates.toISOString().split("T")[0];
      const to_date = toDates.toISOString().split("T")[0];
      fetchCounts(from_date, to_date);
    }
  }, [fromDates, toDates]);
  //////////////////////////////////////////////////

  const fetchCounts = async (from_date, to_date) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/report/vehicle-count`,
        {
          from_date,
          to_date,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      setCounts(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the vehicle count!", error);
    }
  };



  ////////////////////// api call ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////// bar element data /////////////////////////////////////////////////////////

  const sum = series?.reduce((acc, current) => acc + current, 0);
  const unOrgTotal = count?.two_wheeler?.reduce(
    (total, item) => total + item?.total_amount,
    0
  );
  const orgTotal = count?.four_wheeler?.reduce(
    (total, item) => total + item?.total_amount,
    0
  );


  const data = {
    series: [
      {
        name: "Real Time Collection",
        data: series,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        colors: ["#4A3AFF"],
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: axis,
      },
    },
  };

  const donutData = {
    series: [unOrgTotal, orgTotal],
    options: {
      chart: {
        type: "donut",
      },
      colors: ["#4A3AFF", "#C893FD"],

      plotOptions: {
        donut: {
          expandOnClick: false,
        },
      },
      labels: ["Two Wheeler Collection", "Four Wheeler Collection"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    },
  };

  const bar = {
    series: [
      {
        name: "Two Wheeler",
        data: counts?.two_wheeler?.map((item) => item?.vehicle_count),
      },
      {
        name: "Four Wheeler",
        data: counts?.four_wheeler?.map((item) => item?.vehicle_count),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#4A3AFF", "#C893FD"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: uniqueDatess,
      },
    },
  };


  const bar2 = {
    series: [
      {
        name: "UnOrganized",
        data:
          pie?.UnOrganized?.map((item) => item?.total_amount)?.length === 0
            ? [0]
            : pie?.UnOrganized?.map((item) => item?.total_amount),
      },
      {
        name: "Organized",
        data:
          pie?.Organized?.map((item) => item?.total_amount)?.length === 0
            ? [0]
            : pie?.Organized?.map((item) => item?.total_amount),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#4A3AFF", "#C893FD"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: uniqueDates,
      },
    },
  };

  ///////////////////////////////////////////////////// bar element data //////////////////////////////////////////////////

  useEffect(() => {
    //hourly real time data
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/report/hourly-real-time`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("hourly real time data", res.data?.data);
        if (res.data?.data) {
          setHourlyRealTimeData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }, [])


  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/report/statistics`,
        {
          fromDates,
          toDates,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, 'category')
        setStatisticsData(res.data?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fromDates, toDates]);


  // const currentDate = formatDate(new Date());
  const currentDate = new Date().toLocaleDateString();
  const [selectedOption, setSelectedOption] = useState("Yearly");


  const hourlyReceipts = hourlyRealTimeData.map(item => item?.customer_count)
  let buffer = 0
  const cumulativeReceipts = hourlyReceipts.map(item => {
    buffer = buffer + item
    return buffer
  })
  const hourlyReceiptsSum = hourlyReceipts.reduce((sum, item) => sum + item, 0)

  const hourlyAmounts = hourlyRealTimeData.map(item => item?.total_amount)
  let amountBuffer = 0
  const cumulativeAmounts = hourlyAmounts.map(item => {
    amountBuffer = amountBuffer + item
    return amountBuffer
  })
  const hourlyAmountsSum = hourlyAmounts.reduce((sum, item) => sum + item, 0)


  const realTimeCollectionOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
      },
    },
    colors: ["#00599C", "#1A91C1", "#01D8FF", "#00599C"],
    xaxis: {
      categories: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    },
    // legend: {
    //   show: false,
    // },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        useSeriesColors: true // Use the colors defined in the series
      }
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Total Amount",
        data: cumulativeAmounts,
      },
      {
        name: "Total Receipts",
        data: cumulativeReceipts,
      },
    ],
    toolbar: {
      tools: {
        download: true,
      },
    },
    markers: {
      size: 0,
    },
    stroke: {
      curve: "smooth",
    },
  };

  const barchartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
      },
    },

    colors: ["#00599C", "#1A91C1", "#01D8FF", "#00599C"],
    xaxis: {
      categories: categories,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        useSeriesColors: true // Use the colors defined in the series
      }
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Total amount",
        data: totalAmount,
      },
      {
        name: "Total bill cut",
        data: totalBill,
      },
    ],
    toolbar: {
      tools: {
        download: true,
      },
    },
    markers: {
      size: 5,
    },
    stroke: {
      curve: "smooth",
    },
  };


  const dataMap = {
    Yearly: {
      title: "Yearly Collection",
      data: yearlyData,
      total: yearlyData[yearlyData?.length - 1]?.value || 100,
      unit: "₹",
      chart: (
        <ResponsiveContainer width="100%" height={265}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00BCD4" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    Monthly: {
      title: "Monthly ARPU (Last 12 Months)",
      data: monthlyData,
      total: monthlyData[monthlyData?.length - 1]?.value || 100,
      unit: "$",
      chart: (
        <ResponsiveContainer width="100%" height={265}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0288D1" fill="#B3E5FC" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    Weekly: {
      title: "Weekly Revenue Collection",
      data: weeklyData,
      total: weeklyData.reduce((acc, d) => acc + d.value, 0),
      unit: "$",
      chart: (
        <ResponsiveContainer width="100%" height={265}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#03A9F4" barSize={25} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  };

  const { title, total, unit, chart } = dataMap[selectedOption];


  return (
    <>
      <div className="flex flex-1 overflow-y-scroll overflow-x-hidden">
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center mt-5 p-5">

            <div className="flex text-xl font-semibold  mr-4">
              Parking Report

            </div>
          </div>

          <div className="flex flex-col overflow-y-scroll">
            <div className="flex flex-row justify-end item-center mx-10 ">

              <Button
                variant="contained"
                onClick={() => { navigate('/collection-report') }}
              >
                Collection Report
              </Button>
            </div>

            <div className="flex justify-between gap-4 p-4">
              {/* Box 1 */}
              <div className="w-1/3 h-40 bg-white shadow-lg rounded  p-4">
                <div className="flex items-center justify-center ">
                  <i className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <rect width="32" height="32" rx="9" fill="#665DD9" />
                      <path
                        d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                        fill="white"
                        fillOpacity="0.92"
                      />
                    </svg>
                  </i>
                  Real time collection
                </div>
                <div className="w-full flex justify-center pt-4">
                  <div
                    className={` mr-4  flex flex-col items-center justify-center `}>
                    <span className="text-[#095ea4] text-2xl font-bold">
                      ₹{hourlyAmountsSum}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total Amount
                    </h4>
                  </div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="w-1/3 h-40 bg-white shadow-lg rounded  p-4">
                <div className="flex items-center justify-center ">
                  <i className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <rect width="32" height="32" rx="9" fill="#665DD9" />
                      <path
                        d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                        fill="white"
                        fillOpacity="0.92"
                      />
                    </svg>
                  </i>
                  Real time collection
                </div>
                <div className="w-full flex justify-center pt-4">

                  <div
                    className={` mr-4  flex flex-col items-center justify-center `} >
                    <span className="text-[#095ea4] text-2xl font-bold">
                      {hourlyReceiptsSum}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total bill cut
                    </h4>
                  </div>
                </div>
              </div>

              {/* Box 3 */}
              <div className="w-1/3 h-40 bg-white shadow-lg rounded  p-4">
                <div className="flex items-center justify-center ">
                  <i className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <rect width="32" height="32" rx="9" fill="#665DD9" />
                      <path
                        d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                        fill="white"
                        fillOpacity="0.92"
                      />
                    </svg>
                  </i>
                  Real time collection
                </div>
                <div className="w-full flex justify-center pt-4">
                  <div
                    className={` mr-4  flex flex-col items-center justify-center `}>
                    <span className="text-[#095ea4] text-2xl font-bold">
                      ₹{hourlyAmountsSum}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total Amount
                    </h4>
                  </div>
                  <div
                    className={` mr-4  flex flex-col items-center justify-center `} >
                    <span className="text-[#095ea4] text-2xl font-bold">
                      {hourlyReceiptsSum}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total bill cut
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphs sections */}

            <div className="w-full flex flex-row flex-wrap gap-4 mx-5 my-5 ">
              {/* Yearly Collection Card */}
              <div className="w-full md:w-[27%] bg-white shadow-lg rounded-md p-5">
                <div className="flex items-center justify-between text-xl mb-2">
                  <div className="flex items-center">
                    <i className="mr-2">
                      {/* SVG ICON */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="9" fill="#665DD9" />
                        <path
                          d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                          fill="white"
                          fillOpacity="0.92"
                        />
                      </svg>
                    </i>
                    Yearly Collection
                  </div>
                </div>

                <div className="flex justify-end my-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[#095ea4] text-2xl font-bold">
                      ₹{yearlyData.length ? yearlyData[yearlyData.length - 1].value : 0}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">Total Amount</h4>
                  </div>
                </div>

                <div className="w-full">
                  <ResponsiveContainer width="100%" height={265}>
                    <LineChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#00BCD4" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly ARPU Card */}
              <div className="w-full md:w-[36%] bg-white shadow-lg rounded-md p-5">
                <div className="flex items-center justify-between text-xl mb-2">
                  <div className="flex items-center">
                    <i className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <rect width="32" height="32" rx="9" fill="#665DD9" />
                        <path
                          d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                          fill="white"
                          fillOpacity="0.92"
                        />
                      </svg>
                    </i>
                    Monthly Collection
                  </div>
                </div>

                <div className="flex justify-end my-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[#095ea4] text-2xl font-bold">
                      ₹{monthlyData.length ? monthlyData[monthlyData.length - 1].value : 0}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">Total Amount</h4>
                  </div>
                </div>

                <div className="w-full">
                  <ResponsiveContainer width="100%" height={265}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" interval={0} angle={-35} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0288D1"
                        fill="#B3E5FC"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>


              {/* Weekly Revenue Collection */}
          <div className="w-full md:w-[30%] bg-white shadow-lg rounded-md p-5">
  {/* Title Section */}
  <div className="flex items-center justify-between text-xl mb-2">
    <div className="flex items-center">
      <i className="mr-2">
        {/* Your SVG icon here */}
      </i>
      Weekly Collection
    </div>
  </div>

  {/* Calendar Input */}
  <div className="mb-4">
    <input
      type="month"
      className="border px-2 py-1 rounded"
      value={selectedMonth.toISOString().slice(0, 7)}
      onChange={(e) => setSelectedMonth(new Date(e.target.value))}
    />
  </div>

  {/* Total Display */}
  <div className="flex justify-end my-2">
    <div className="flex flex-col items-center">
      <span className="text-[#095ea4] text-2xl font-bold">
        ₹{weeklyData?.reduce((acc, d) => acc + (d?.value ?? 0), 0)}
      </span>
      <h4 className="text-center text-xs whitespace-nowrap">Total Amount</h4>
    </div>
  </div>

  {/* Chart */}
  <div className="w-full">
    <ResponsiveContainer width="100%" height={265}>
      <BarChart data={weeklyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#03A9F4"
          barSize={25}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>




            </div>


            <div className="flex flex-1 justify-center items-center">

              {/* col-1 */}

              <div
                className={` w-auto md:w-1/2 sm:w-full h-auto mx-5 my-5 flex flex-col relative bg-[#fff] shadow-lg `}  >
                <div className="w-full flex flex-col sm:flex-row justify-between">

                  <div
                    className={` w-auto  sm:w-full h-auto mx-5 my-5 flex flex-col overflow-auto relative bg-[#fff] p-5 shadow-lg rounded-md`} >

                    <div className="flex items-center justify-between text-xl">
                      <div className="flex items-center">
                        <i className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                          >
                            <rect width="32" height="32" rx="9" fill="#665DD9" />
                            <path
                              d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                              fill="white"
                              fillOpacity="0.92"
                            />
                          </svg>
                        </i>
                        Real time collection
                      </div>
                      <div className={`flex`}>
                        <div className="w-full flex flex-col sm:flex-row justify-between ">
                          <div
                            className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                          >
                            <span className="text-sm">
                              {currentDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-end ">
                      <div
                        className={` mr-4  flex flex-col items-center justify-center `}>
                        <span className="text-[#095ea4] text-2xl font-bold">
                          ₹{hourlyAmountsSum}
                        </span>
                        <h4 className="text-center text-xs whitespace-nowrap">
                          Total Amount
                        </h4>
                      </div>
                      <div
                        className={` mr-4  flex flex-col items-center justify-center `} >
                        <span className="text-[#095ea4] text-2xl font-bold">
                          {hourlyReceiptsSum}
                        </span>
                        <h4 className="text-center text-xs whitespace-nowrap">
                          Total bill cut
                        </h4>
                      </div>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row justify-between">
                      <div className={` m-1 flex flex-col relative p-5 w-full`}>
                        <Chart
                          options={realTimeCollectionOptions}
                          series={realTimeCollectionOptions.series}
                          type="line"
                          height={265}
                          width={"100%"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-col h-[400px] flex-1 justify-start items-center rounded-md shadow-xl border-2  bg-white m-2">
                <div className="flex flex-row w-full h-fit justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Real-time Collection
                    </div>
                  </div>

                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2  text-gray-400 ml-[-2rem]" />
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={data.options}
                        series={data.series}
                        type="line"
                        height="300"
                        width="470"
                      />
                    </div>
                    <div className="flex-col mt-[9rem] p-2 justify-center items-center">
                      <p className="text-xl ">
                        ₹{" "}
                        <span className="font-bold text-green-500">{sum}</span>
                      </p>
                      <p className="text-sm ">
                        Total amount of Current<br></br> Collection
                      </p>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div> */}

              {/* col-2 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">Weekly Collection</div>
                  </div>
                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            onChange={(date) => setFromDate(date)}
                            selectsStart
                            selected={fromDate}
                            startDate={fromDate}
                            endDate={toDate}

                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            selectsEnd
                            startDate={fromDate}
                            endDate={toDate}
                            minDate={fromDate}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={donutData.options}
                        series={donutData.series}
                        type="donut"
                        height="300"
                        width="350"
                      />
                    </div>

                    <div className="flex gap-2 grid-cols-2 mt-[9rem]  justify-center items-center">
                      <div className="flex flex-1 flex-col">
                        <p className="text-xl">
                          ₹{" "}
                          <span className="font-bold text-green-500">
                            {unOrgTotal}
                          </span>
                        </p>
                        <p className="text-sm ">
                          Total Two Wheeler<br></br> Collection
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <p className="text-xl ">
                          ₹{" "}
                          <span className="font-bold text-green-500">
                            {orgTotal}
                          </span>
                        </p>
                        <p className="text-sm">
                          Total Four Wheeler<br></br> Collection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
              {/* col-1 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Weekly Vehicle Count
                    </div>
                  </div>
                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            selected={fromDates}
                            onChange={(date) => setFromDates(date)}
                            selectsStart
                            startDate={fromDates}
                            endDate={toDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                            selected={toDates}
                            onChange={(date) => setToDates(date)}
                            selectsEnd
                            startDate={fromDates}
                            endDate={toDates}
                            minDate={fromDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center mt-3">
                    <div>
                      <Chart
                        options={bar.options}
                        series={bar.series}
                        type="bar"
                        height="300"
                        width="600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* col-2 */}

              <div className="flex flex-col h-[400px] flex-1 justify-start items-center border-2 rounded-md shadow-xl bg-white m-2 relative">
                <div className="flex flex-row w-full h-[50px] justify-between">
                  <div className="flex flex-1 items-center mt-6 ml-5 flex-row gap-1">
                    <div className="flex h-fit w-fit p-2 bg-[#665DD9] rounded-md">
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.8817 0.956787C18.8606 0.956787 21.3554 3.26581 21.3554 6.99251V9.23363L21.3482 9.33384C21.2957 9.69433 20.9643 9.97217 20.5633 9.97217H20.5542L20.4291 9.96283C20.2647 9.93808 20.1119 9.86486 19.994 9.75238C19.8466 9.61177 19.7662 9.42169 19.7712 9.22514V6.99251C19.7712 4.0553 18.0321 2.43388 14.8817 2.43388H7.12426C3.96481 2.43388 2.23486 4.0553 2.23486 6.99251V14.2337C2.23486 17.1709 3.97392 18.7838 7.12426 18.7838H14.8817C18.0412 18.7838 19.7712 17.1624 19.7712 14.2337C19.7712 13.8258 20.1258 13.4951 20.5633 13.4951C21.0008 13.4951 21.3554 13.8258 21.3554 14.2337C21.3554 17.9519 18.8789 20.2609 14.8909 20.2609H7.12426C3.12715 20.2609 0.650581 17.9519 0.650581 14.2337V6.99251C0.650581 3.26581 3.12715 0.956787 7.12426 0.956787H14.8817ZM6.60527 8.24889C6.8154 8.25553 7.01408 8.33979 7.15754 8.48309C7.301 8.6264 7.37747 8.817 7.3701 9.01291V15.1845C7.35501 15.5924 6.98813 15.9116 6.55064 15.8975C6.11316 15.8835 5.77073 15.5414 5.78582 15.1335V8.95349L5.79993 8.83799C5.8317 8.6866 5.91436 8.54739 6.03756 8.44147C6.19155 8.30906 6.39602 8.2397 6.60527 8.24889ZM11.0394 5.35412C11.4769 5.35412 11.8316 5.68478 11.8316 6.09267V15.142C11.8316 15.5499 11.4769 15.8806 11.0394 15.8806C10.6019 15.8806 10.2473 15.5499 10.2473 15.142V6.09267C10.2473 5.68478 10.6019 5.35412 11.0394 5.35412ZM15.4281 11.5087C15.8655 11.5087 16.2202 11.8394 16.2202 12.2472V15.1335C16.2202 15.5414 15.8655 15.8721 15.4281 15.8721C14.9906 15.8721 14.6359 15.5414 14.6359 15.1335V12.2472C14.6359 11.8394 14.9906 11.5087 15.4281 11.5087Z"
                          fill="white"
                          fill-opacity="0.92"
                        />
                      </svg>
                    </div>
                    <div className="flex font-semibold">
                      Weekly Vehicle Collection
                    </div>
                  </div>

                  <div className="">
                    <div className="flex p-4 gap-3">
                      <div className="items-center mb-4">
                        <div className="relative">
                          <DatePicker
                            onChange={(date) => setNFromDates(date)}
                            selectsStart

                            selected={nfromDates}
                            startDate={nfromDates}
                            endDate={ntoDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">to</div>

                      <div className="items-center">
                        <div className="relative">
                          <DatePicker
                            selected={ntoDates}
                            onChange={(date) => setNToDates(date)}
                            selectsEnd

                            startDate={nfromDates}
                            endDate={ntoDates}
                            minDate={nfromDates}
                            dateFormat="yyyy-MM-dd"
                            className="p-2 border rounded-md pl-10 w-[9rem] cursor-pointer"
                          />
                          <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full h-full mt-3">
                  <div className="flex text-center grid-cols-2 gap-3 justify-center">
                    <div>
                      <Chart
                        options={bar2.options}
                        series={bar2.series}
                        type="bar"
                        height="300"
                        width="600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
              <div className={` w-full h-auto mx-5 my-5 flex flex-col overflow-auto relative bg-[#fff] p-5 shadow-lg rounded-md`}>
                <div className="flex items-center justify-between text-xl">
                  <div className="flex items-center">
                    <i className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <rect width="32" height="32" rx="9" fill="#665DD9" />
                        <path
                          d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                          fill="white"
                          fillOpacity="0.92"
                        />
                      </svg>
                    </i>
                    Statistics
                  </div>
                  <div className={`flex`}>
                    <div className="w-full flex flex-col sm:flex-row justify-between ">
                      <div
                        className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                      >
                        <span className="text-[#095ea4] text-2xl font-bold">
                          {totalAmountSum}
                        </span>
                        <h4 className="text-center text-xs whitespace-nowrap">
                          Total Amount
                        </h4>
                      </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between ">
                      <div
                        className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                      >
                        <span className="text-[#1dafc9] text-2xl font-bold">
                          {totalBillSum}
                        </span>
                        <h4 className="text-center text-xs whitespace-nowrap">
                          Total Customer Count
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-between">
                  <div className={` m-1 flex flex-col relative p-5 w-full`}>
                    <Chart
                      options={barchartOptions}
                      series={barchartOptions.series}
                      type="line"
                      height={265}
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
