
import { Box, Button, useTheme } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveBar } from "@nivo/bar";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../theme";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { printChart } from "../utils/Functions";
/* import { mockBarData as data } from "../data/CostData"; */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getMaintenanceCostChart,
  getMaintenanceCostChartFiltered,
} from "../features/AnalyticsSlice";
import { getMachines } from "../features/MachineSlice";
import { getDepartments } from "../features/DepartmentSlice";
import Row from "react-bootstrap/Row";
import {
  ComposedChart,
  Bar,
    Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const keys = [

  "Total Maintenance cost (TND)",
];
const MaintenanceCostChartByMachines = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorTable = ["red", "green", "blue", "yellow"];
  const element1 = document.getElementById("divToPrint");
  const element2 = document.getElementById("PrintTable");
  const { machines } = useSelector((state) => state.storeMachines);
  const [parameter, setParameter] = useState();
  const [data, setData] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-EN', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  const { maintenanceCostChartsFiltered } = useSelector(
    (state) => state.storeAnalytics
  );

  const dispatch = useDispatch();


 /*  const colors2 = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'] */

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  } 
  const colors2 = Array.from({length: 100}, () => getRandomColor()); 
  useEffect(() => {
    dispatch(getMaintenanceCostChart());
    dispatch(getMaintenanceCostChartFiltered());
    dispatch(getMachines());
    dispatch(getDepartments());
  }, [dispatch]);


  useEffect(() => {
    const allMonths = maintenanceCostChartsFiltered.flatMap(item => item.data.map(dataItem => dataItem.month));
    const uniqueMonths = [...new Set(allMonths)];
    setMonthOptions(uniqueMonths);
  
    const allYears = maintenanceCostChartsFiltered.flatMap(item => item.data.map(dataItem => dataItem.year));
    const uniqueYears = [...new Set(allYears)];
    setYearOptions(uniqueYears);
  
    const mappedData = maintenanceCostChartsFiltered
      .filter(item => machines.some(machine => machine._id === item.parameter))
      .map(item => {
        const machine = machines.find(machine => machine._id === item.parameter);
        const nameMachine = machine.nameMachine;
        
        return {
          ...item,
          parameter: nameMachine,
          data: item.data
            .filter(dataItem => 
              (selectedMonth ? dataItem.month === selectedMonth : dataItem.month === new Date().toLocaleString('en-EN', { month: 'long' })) &&
              (selectedYear ? dataItem.year === selectedYear : dataItem.year === new Date().getFullYear().toString())
            )
            .map(dataItem => ({
              ...dataItem,
              'machine.nameMachine': nameMachine
            }))
        };
      })
      .filter(item => item.data.length > 0);
    
    setData(mappedData);
  }, [
    maintenanceCostChartsFiltered,
    parameter,
    selectedYear,
    selectedMonth,
  ]);
  

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };
  
  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
  
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  return (
    <>
    {!isDashboard && (
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            type="button"
            onClick={() => {
              printChart(element1, element2);
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>



        <Row className="mb-2 p-2">
              <Form.Group as={Col} sm="12" md="3" className="mb-1 ms-2">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    style={{ width: "150px",  }}
                    as="select"
                    type="select"
                    id="select-month"
                    value={selectedMonth} 
                    onChange={(e) => {
                      setSelectedMonth(e.target.value)
                    }}
                  >
                   <option value="">Select month</option>
  {monthOptions.map(month => <option key={month} value={month}>{month}</option>)}
                  </Form.Control>
                </div>
              </Form.Group>

              <Form.Group as={Col} sm="12" md="3" className="mb-1 ms-2">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    style={{ width: "150px", marginLeft: "40px" }}
                    as="select"
                    type="select"
                    id="select-year"
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value)
                    }}
                  >
                    <option value="">Select year</option>
  {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                
                  </Form.Control>
                </div>
              </Form.Group>
              </Row>


      </Box>
    )}

<ResponsiveContainer width="100%" height="100%" id="divToPrint">
  <ComposedChart
    data={data}
    margin={{ top: 70, right: 10, bottom: 20, left: 10 }}
  >
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="parameter" label={{ value: "Machine", dy: 18 }} />
    <YAxis
      yAxisId="left"
      label={{ value: "TND", angle: -90, position: "insideLeft" }}
    />

    <Bar yAxisId="left"
      dataKey="data[0]['Total Maintenance cost (TND)']"
      stackId="a" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors2 [index % 20]} />
        ))}
      </Bar>
    {!isDashboard && (
      <text
        x={290}
        y={30}
        textAnchor="middle" style={{ fontSize: '25px' , fill: "rgba(40, 183, 154, 0.999)" }}
      >
   
        Maintenance Cost
        Chart Of All Machine{" "}{selectedMonth}{" "}{selectedYear}
      </text>
    )}
  </ComposedChart>
</ResponsiveContainer>
{!isDashboard && (
  <div id="PrintTable" className=" mt-4" fill="transparent">
    <div style={{ padding: "10px" }} className="Table">
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid ",
        }}
      >
        <thead>
          <tr>
            <th></th>
            {data.map((d) => (
              <th
                style={{
                  width: "10%",
                  border: "1px solid ",
                  textAlign: "center",
                }}
                key={d.parameter}
              >
                {d.parameter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((key, index) => {
            const color = colorTable[index % colorTable.length];
            return (
              <tr key={key}>
                <td style={{ border: "1px solid " }}>
                  {key !== "Total Maintenance cost (TND)" && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        backgroundColor: color,
                        margin: "2px",
                      }}
                    />
                  )}
                  {key}
                </td>
                {data.map((d) => (
                  <td
                    key={d.parameter}
                    style={{ border: "1px solid ", textAlign: "center" }}
                  >
                    {parseFloat(d.data[0][key]).toFixed(2)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

  </>
);

};

export default MaintenanceCostChartByMachines;
