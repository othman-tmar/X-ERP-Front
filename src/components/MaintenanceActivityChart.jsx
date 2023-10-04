import { Box, Button, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
/* import { ResponsiveBar } from "@nivo/bar"; */
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../theme";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {printChart} from "../utils/Functions"
/* import { mockBarData as data } from "../data/CostData"; */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getMaintenanceActivityChart,getMaintenanceActivityChartFiltered} from "../features/AnalyticsSlice";
import { getMachines } from "../features/MachineSlice";
import { getDepartments } from "../features/DepartmentSlice";
import Row from "react-bootstrap/Row";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer ,
} from "recharts";

const keys=[  "Preventives Downtime (H)" ,"Corretives Downtime (H)","Correctives Number","Preventives Number","Preventives Planned Number","Preventives Achievement Percentage(%)"]


const MaintenanceActivityChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorTable=['red', 'green', 'blue','aqua','yellow','violet'];
const element1 = document.getElementById("divToPrint");
const element2 = document.getElementById("PrintTable");

const { departments } = useSelector((state) => state.storeDepartments);
const { machines } = useSelector((state) => state.storeMachines);

const [data, setData] = useState([]);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
const [years, setYears] = useState([]);
const [departmentID, setDepartmentID] = useState("");
const [machineID, setMachineID] = useState("");
const [parameter, setParameter] = useState();
const [titleChart, setTitleChart] = useState();
const [filteredMachines, setFilteredMachines] = useState([]);
  const { maintenanceActivityCharts,maintenanceActivityChartsFiltered } = useSelector( (state) => state.storeAnalytics  );

  

    const dispatch = useDispatch();

    useEffect(() => {
    dispatch(getMaintenanceActivityChart());
    dispatch(getMaintenanceActivityChartFiltered());
    dispatch(getMachines());
    dispatch(getDepartments());
    },[dispatch])



    useEffect(() => {
      let filteredData = maintenanceActivityCharts;
  
      // If parameter is defined, use maintenanceActivityChartsFiltred for filtering
      if (parameter) {
        filteredData = maintenanceActivityChartsFiltered.filter(
          (item) => item.parameter === parameter
        );
        // Flatten the data
        filteredData = filteredData.flatMap((item) => item.data);
      }
  
      // Filter data based on the selected year
      filteredData = filteredData.filter((d) => d.year === selectedYear);
   // Define the order of months
   const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              
   // Sort data by month
   const sortedData = filteredData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
   
   setData(sortedData);
     
    }, [
      maintenanceActivityCharts,
      maintenanceActivityChartsFiltered,
      parameter,
      selectedYear,
    ]);
  
    useEffect(() => {
      setYears([...new Set(maintenanceActivityCharts.map((d) => d.year))]);
    }, [maintenanceActivityCharts]);
  
    useEffect(() => {
      if (departmentID) {
        setFilteredMachines(
          machines.filter((mach) => mach.departmentID._id == departmentID)
        );
      } else {
        setFilteredMachines(machines);
      }
    }, [departmentID, machines]);
  
   

      const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              {payload.map((item, index) => (
                <p key={index} style={{ color: item.color }}>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: item.color }} />
                  <strong style={{ marginLeft: '5px' }}>
                    {`${item.name}: ${item.value}`}
                  </strong>
                </p>
              ))}
            </div>
          );
        }
      
        return null;
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
          
          printChart(element1,element2);
        }}
      >
        <DownloadOutlinedIcon sx={{ mr: "10px" }} /> 
        Download Reports
      </Button>
    </Box>
    <div>
            <Row className="mb-2 p-2">
             

              <Form.Group as={Col} sm="12" md="3" className="mb-1 ms-2">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    style={{ width: "150px"}}
                    as="select"
                    type="select"
                    id="select-department"
                    value={departmentID}
                    onChange={(e) => {
                      if (e.target.value === "All Departments") {
                        setDepartmentID();
                        setParameter();
                      } else {
                        setDepartmentID(e.target.value);
                        setMachineID();
                        setParameter(e.target.value);
                      }
                      let dep = departments.find(dep => e.target.value == dep._id);
                      if(dep) {
                          setTitleChart(dep.nameDepartment);
                      } else {
                        setTitleChart();
                      }
                    }}
                  >
                    <option className="text-center">All Departments</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>
                        {dep.nameDepartment}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>

              <Form.Group as={Col} sm="12" md="3" className="mb-1 ms-2">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    style={{ width: "150px", marginLeft: "50px" }}
                    as="select"
                    type="select"
                    id="select-machine"
                    value={parameter}
                    onChange={(e) => {
                      if (e.target.value === "All Machines") {
                        setMachineID();
                        setParameter();
                      } else {
                        setMachineID(e.target.value);
                        setDepartmentID();
                        setParameter(e.target.value);
                      }
                      let mach = filteredMachines.find(
                        (mach) => e.target.value === mach._id
                      );
                      if (mach) {
                        setTitleChart(mach.nameMachine);
                      } else {
                        setTitleChart();
                      }
                    }}
                  >
                    <option className="text-center">All Machines</option>
                    {filteredMachines.map((mach) => (
                      <option key={mach._id} value={mach._id}>
                        {mach.nameMachine}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Form.Group>
            </Row>
          </div>
    <Form.Group as={Col} sm="12" md="3" lg='2' className='mb-1 ms-2' style={{ display: 'flex', alignItems: 'right'}}>
                    
                      <Form.Control
                       style={{ width: '150px',marginLeft: '20px' }}
                        as="select"
                        type="select"
                        id="select-year"
                        value={selectedYear}
                      
                        onChange={(e) => {
                          setSelectedYear(e.target.value);
                        }}
                      >
                        
                        {years.map(year => (
                                 <option className="text-center" key={year} value={year}>{year}</option>
                            ))
                          }
                      </Form.Control>
                    
                    </Form.Group>
    </Box>)}
    <ResponsiveContainer width="100%" height="100%"  id="divToPrint" >
      
    <ComposedChart
    
  data={data}
  margin={{ top: 70, right:10, bottom: 20, left: 10 }}
>


  <CartesianGrid strokeDasharray="3 3" vertical={false} />
  <XAxis dataKey="month" label={{ value: 'Month', dy: 18 }} />
  <YAxis yAxisId="left" label={{ value: 'Hour', angle: -90, position: 'insideLeft' }}/>
  <YAxis yAxisId="right" orientation="right" label={{ value: 'Number', angle: -90, position: 'insideLeft', dx: 20  }} />
  <YAxis yAxisId="right2" orientation="right" label={{ value: '%', angle: -90, position: 'insideLeft' , dx: 25 }}  />
  <Tooltip content={<CustomTooltip />} />
  <Bar yAxisId="left" dataKey="Preventives Downtime (H)" stackId="a" fill={colorTable[0]} />
  <Bar yAxisId="left" dataKey="Corretives Downtime (H)" stackId="a" fill={colorTable[1]} />
  <Line yAxisId="right" type="monotone" dataKey="Correctives Number" stroke={colorTable[2]} strokeWidth={2} />
  <Line yAxisId="right" type="monotone" dataKey="Preventives Number" stroke={colorTable[3]} strokeWidth={2} />
  <Line yAxisId="right" type="monotone" dataKey="Preventives Planned Number" stroke={colorTable[4]} strokeWidth={2} />
  <Line yAxisId="right2" type="monotone" dataKey="Preventives Achievement Percentage(%)" stroke={colorTable[5]} strokeWidth={2} />
  {!isDashboard && (
            <text
              x={250}
              y={30}
              textAnchor="middle" style={{ fontSize: '25px' , fill: "rgba(40, 183, 154, 0.999)" }}
            >
              {" "}
              Maintenance Activity{" "}
              {!titleChart ||
              titleChart === "All Departments" ||
              titleChart === "All Machines"
                ? "Totale"
                : titleChart}{" "}
              Chart{" "} {selectedYear}
            </text>
          )}
</ComposedChart>

</ResponsiveContainer>
     {!isDashboard && (
      <div className=" mt-4" fill="transparent" id="PrintTable">
  <div style={{padding:"10px"}} className="Table">
   <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid " }}  >
    <thead>
        <tr>
            <th></th>
            {data.map(d => <th style={{width: "10%", border: "1px solid " , textAlign:"center"}} key={d.month}>{d.month}</th>)}
        </tr>
    </thead>
    <tbody>
        {keys.map((key, index) => {
            const color = colorTable[index % colorTable.length];
            return (
                <tr key={key}>
                    <td style={{ border: "1px solid "}}>
                       
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: color,margin:"2px"}} />
                    
                        {key}
                    </td>
                    {data.map(d => <td key={d.month} style={{ border: "1px solid ", textAlign:"center"}}>{parseFloat(d[key]).toFixed(2)}</td>)}
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

export default MaintenanceActivityChart;
