import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import MaintenanceCostChartBar from "./scenes/bar/MaintenanceCostChartBar";
import MaintenanceActivityChartBar from "./scenes/bar/MaintenanceActivityChartBar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import MaintenaceCostChartBarByMachines from "./scenes/bar/MaintenaceCostChartBarByMachines.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AffectedCalendar from "./scenes/affectedCalendar";
import PlanningCalendar from "./scenes/planningCalendar";
import EmployeesApp from "./components/employees/EmployeesApp";
import CorrectivesApp from "./components/correctives/CorrectivesApp";
import PreventivesApp from "./components/preventives/PreventivesApp";
import MachinesApp from "./components/machines/MachinesApp";
import DetailsCorrective from "./components/correctives/DetailsCorrective";
import DepartmentsApp from "./components/departments/DepartmentsApp";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import AffectedCalendarApp from "./scenes/affectedCalendar/AffectedCalendarApp";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <ToastContainer />
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              
              <Route path="" element={<Dashboard />} />
              
              <Route path="/team" element={<EmployeesApp />} />
              <Route path="/departments" element={<DepartmentsApp />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/preventives" element={<PreventivesApp />} />
              {/* <Route path="/invoices" element={<Invoices />} /> */}
              <Route path="/correctives" element={<CorrectivesApp />} />
              <Route path="/form" element={<Form />} />
              <Route path="/maintenanceCost" element={<MaintenanceCostChartBar />} />
              <Route path="/maintenanceActivity" element={<MaintenanceActivityChartBar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              {/* <Route path="/faq" element={<FAQ />} /> */}
              <Route path="/machines" element={<MachinesApp />} />
              <Route path="/affectedCalendar" element={<AffectedCalendar />} />
              <Route path="/planningCalendar" element={<PlanningCalendar />} />
              <Route path="/maintenanceCostByMachines" element={<MaintenaceCostChartBarByMachines />} />
              
              
            </Routes>
          </main> 
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
